import data from '../data/krs.json';
interface OrganizationEntry {
  KRS: number;
  OrganizationName: string;
  LegalForm: string;
  Representatives: string[];
  RepresentativesID: number;
  ConnectedOrganizations: Record<number, string> | null;
}

const entries: OrganizationEntry[] = data as OrganizationEntry[];

export function processData() {
  const companies = new Map<number, any>();
  const representatives = new Map<number, any>();
  const links_: any[] = [];

  entries.forEach(entry => {
    const company = {
      id: Number(entry.KRS),
      name: entry.OrganizationName,
      type: entry.LegalForm,
    };
    companies.set(company.id, company);
    
    const representative = {
      id: entry.RepresentativesID,
      name: entry.Representatives
    };
    representatives.set(representative.id, representative);
    
    const connectedOrganizations = entry.ConnectedOrganizations || {};
    const organizationsArray = Object.entries(connectedOrganizations).map(([name, id]) => ({ id, name }));

    organizationsArray.forEach((org) => {
      const new_id = Number(org.id.replace(/['"]/g, ''));
      links_.push({ source: company.id, target: new_id, representative: representative.id });
      if (!companies.has(new_id)) {
        companies.set(new_id, { id: new_id, name: org.name, type: 'unknown' });
      }
    });
  });

  const links = links_.slice(1);

  console.log('Companies:', Array.from(companies.values()));
  console.log('Representatives:', Array.from(representatives.values()));
  console.log('Links:', links);

  return { companies: Array.from(companies.values()), representatives: Array.from(representatives.values()), links };
}

function findConnectedComponents(companies: any[], links: any[]): any[] {
  const adjList = new Map<number, number[]>();
  companies.forEach(company => adjList.set(company.id, []));
  links.forEach(link => {
    adjList.get(link.source)?.push(link.target);
    adjList.get(link.target)?.push(link.source);
  });
  console.log(adjList);

  const visited = new Set<number>();
  const components: any[] = [];

  function iterativeDFS(start: number) {
      const stack = [start];
      const component: number[] = [];
      
      while (stack.length > 0) {
          const node = stack.pop();
          if (node !== undefined && !visited.has(node)) {
              visited.add(node);
              component.push(node);
              const neighbours = adjList.get(node) || [];
              for (const neighbour of neighbours) {
                  if (!visited.has(neighbour)) {
                      stack.push(neighbour);
                  }
              }
          }
      }

      return component;
  }

  adjList.forEach((_, node) => {
    if (!visited.has(node)) {
      const component = iterativeDFS(node);
      if (component.length > 1) {
        components.push(component);
      }
    }
  });

  return components;
}


export function prepareData(minNodes: number, maxNodes: number) {
  const { companies, links } = processData();
  const components = findConnectedComponents(companies, links);
  console.log(components);
  const filteredComponents = components.filter(c => c.length >= minNodes && c.length <= maxNodes);

  const filteredCompanyNames = new Set(filteredComponents.flat());
  const filteredCompanies = companies.filter(company => filteredCompanyNames.has(company.id));
  const filteredLinks = links.filter(link => filteredCompanyNames.has(link.source) && filteredCompanyNames.has(link.target));

  console.log('Filtered Companies:', filteredCompanies);
  console.log('Filtered Links:', filteredLinks);

  return { companies: filteredCompanies, links: filteredLinks };
}
