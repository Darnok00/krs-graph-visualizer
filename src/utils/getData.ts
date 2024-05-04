import data from '../data/converted_krs_data_js.json';

type OrganizationEntry = {
    OrganizationName: string;
    Representatives: string;
    ConnectedOrganizations: string | null;
};

const entries: OrganizationEntry[] = data as OrganizationEntry[];

export function processData() {
  const companies = new Map<string, any>();
  const links: any[] = [];

  entries.forEach(entry => {
    const organizations = entry.ConnectedOrganizations ?
      [entry.OrganizationName, ...entry.ConnectedOrganizations.split(', ')] :
      [entry.OrganizationName];

    organizations.forEach((org, index) => {
      companies.set(org, { name: org });

      for (let i = index + 1; i < organizations.length; i++) {
        links.push({ source: org, target: organizations[i], representative: entry.Representatives });
        links.push({ source: organizations[i], target: org, representative: entry.Representatives });
    }
    });
  });

  return { companies: Array.from(companies.values()), links };
}

function findConnectedComponents(companies: any[], links: any[]): any[] {
    const adjList = new Map<string, string[]>();
    companies.forEach(company => adjList.set(company.name, []));
    links.forEach(link => {
      adjList.get(link.source)?.push(link.target);
      adjList.get(link.target)?.push(link.source);
    });

    const visited = new Set<string>();
    const components: any[] = [];

    function dfs(node: string, component: string[]) {
      visited.add(node);
      component.push(node);
      adjList.get(node)?.forEach(neighbour => {
        if (!visited.has(neighbour)) {
          dfs(neighbour, component);
        }
      });
    }

    adjList.forEach((_, node) => {
      if (!visited.has(node)) {
        const component: string[] = [];
        dfs(node, component);
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
  const filteredComponents = components.filter(c => c.length >= minNodes && c.length <= maxNodes);

  const filteredCompanyNames = new Set(filteredComponents.flat());
  const filteredCompanies = companies.filter(company => filteredCompanyNames.has(company.name));
  const filteredLinks = links.filter(link => filteredCompanyNames.has(link.source) && filteredCompanyNames.has(link.target));

  return { companies: filteredCompanies, links: filteredLinks };
}
