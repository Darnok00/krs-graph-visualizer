import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { prepareData } from '../utils/getData';
import './style.css'; 

const FullGraph: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [minDegree, setMinDegree] = useState(20);
    const [maxDegree, setMaxDegree] = useState(21);
    const [inputMinDegree, setInputMinDegree] = useState(20);
    const [inputMaxDegree, setInputMaxDegree] = useState(21);
    const [graphCount, setGraphCount] = useState(0);

    useEffect(() => {
        const { companies, links } = prepareData(minDegree, maxDegree);
        console.log('Companies:', companies);
        console.log('Links:', links);
        setGraphCount(calculateGraphCount(companies, links));
        if (svgRef.current) {
            renderGraph(companies, links);
        }
    }, [minDegree, maxDegree]);

    const updateGraph = () => {
        const { companies, links } = prepareData(inputMinDegree, inputMaxDegree);
        console.log('Updated Companies:', companies);
        console.log('Updated Links:', links);
        setMinDegree(inputMinDegree);
        setMaxDegree(inputMaxDegree);
        setGraphCount(calculateGraphCount(companies, links));
        if (svgRef.current) {
            renderGraph(companies, links);
        }
    };

    const calculateGraphCount = (companies: any[], links: any[]) => {
        const nodes = new Set(companies.map(c => c.id));
        const adjList = new Map();

        nodes.forEach(node => adjList.set(node, []));
        links.forEach(link => {
            adjList.get(link.source).push(link.target);
            adjList.get(link.target).push(link.source);
        });

        const visited = new Set();
        let count = 0;

        const dfs = (node: any) => {
            const stack = [node];
            while (stack.length > 0) {
                const current = stack.pop();
                adjList.get(current).forEach((neighbor: unknown) => {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        stack.push(neighbor);
                    }
                });
            }
        };

        nodes.forEach(node => {
            if (!visited.has(node)) {
                visited.add(node);
                count++;
                dfs(node);
            }
        });

        return count;
    };

    const getColor = (type: string) => {
        switch(type) {
            case 'związek zawodowy':
                return 'blue';
            case 'spółka z ograniczoną odpowiedzialnością':
                return 'red';
            case 'stowarzyszenie':
                return 'green';
            case 'cech rzemieślniczy':
                return 'yellow';
            case 'federacja / konfederacja związków pracodawców':
                return 'pink';
            case 'fundacja':
                return 'orange';
            case 'inna organizacja społeczna lub zawodowa':
                return 'purple';
            case 'izba gospodarcza':
                return '#7FFF00';
            case 'izba rzemieślnicza':
                return '#7FFFD4';
            case 'jednostka organizacyjna związku zawodowego posiadająca osobowość prawną':
                return 'brown';
            case 'kółko rolnicze':
                return '#556B2F';
            case 'jednostka terenowa stowarzyszenia posiadająca osobowość prawną':
                return '#8A2BE2';
            case 'ogólnokrajowy związek międzybranżowy':
                return '#5F9EA0';
            case 'ogólnokrajowe zrzeszenie międzybranżowe':
                return '#D2691E';
            case 'rolnicze zrzeszenie branżowe':
                return '#FF7F50';
            case 'polski związek sportowy':
                return '#6495ED';
            case 'samodzielny publiczny zakład opieki zdrowotnej':
                return '#DC143C';
            case 'spółdzielnia':
                return '#00FFFF';
            case 'spółdzielcza kasa oszczędnościowo-kredytowa':
                return '#00008B';
            case 'spółka akcyjna':
                return '#008B8B';
            case 'spółka jawna':
                return '#B8860B';
            case 'spółka komandytowa':
                return '#A9A9A9';
            case 'spółka komandytowo-akcyjna':
                return '#006400';
            case 'spółka partnerska':
                return '#BDB76B';
            case 'stowarzyszenie kultury fizycznej':
                return '#8B008B';
            case 'stowarzyszenie kultury fizycznej o zasięgu ogólnokrajowym':
                return '#556B2F';
            case 'towarzystwo ubezpieczeń wzajemnych':
                return '#FF8C00';
            case 'zrzeszenie handlu i usług':
                return '#9932CC';
            case 'zrzeszenie transportu':
                return '#8B0000';
            case 'związek pracodawców':
                return '#E9967A';
            case 'związek rolniczych zrzeszeń branżowych':
                return '#8FBC8F';
                case 'związek sportowy':
                    return '#483D8B';
                case 'związek stowarzyszeń':
                    return '#2F4F4F';
                case 'związek zawodowy rolników indywidualnych':
                    return '#00CED1';
                case 'związki rolników, kółek i organizacji rolniczych':
                    return '#9400D3';
                case 'instytut badawczy / instytut działający w ramach sieci badawczej łukasiewicz':
                    return '#FF1493';
                case 'oddział zagranicznego przedsiębiorcy':
                    return '#00BFFF';
                default:
                    return 'gray';
            }
        };
    
        const renderGraph = (companies: any[], links: any[]) => {
            const validNodes = new Set(companies.map(c => c.id));
            const validLinks = links.filter(link => validNodes.has(link.source) && validNodes.has(link.target));
        
            console.log('Valid Nodes:', validNodes);
            console.log('Valid Links:', validLinks);
        
            const svg = d3.select(svgRef.current);
            svg.selectAll('*').remove();
            const width = window.innerWidth;
            const height = 800;
        
            const zoom = d3.zoom().on('zoom', (event: any) => { g.attr('transform', event.transform); });
            svg.call(zoom);
            const g = svg.append('g');
        
            const simulation = d3.forceSimulation(companies)
                .force('link', d3.forceLink(validLinks).id((d: { id: any; }) => d.id).distance(50))
                .force('charge', d3.forceManyBody().strength(-50))
                .force('center', d3.forceCenter(width / 2, height / 2));
        
            const link = g.append('g').attr('stroke', '#999').selectAll('line')
                .data(validLinks)
                .enter()
                .append('line')
                .attr('stroke-opacity', 0.6)
                .on('click', (_: any, d: { source: { id: any; }; target: { id: any; }; representative: any; }) => {
                    alert(`Link between ${d.source.id} and ${d.target.id}, representative ID: ${d.representative}`);
                });
        
            const node = g.append('g').attr('stroke', '#fff').attr('stroke-width', 1.5)
                .selectAll('circle')
                .data(companies)
                .enter()
                .append('circle')
                .attr('r', 5)
                .attr('fill', d => getColor(d.type))
                .on('click', (_: any, d: { name: any; }) => {
                    alert(`Company: ${d.name}`);
                });
        
            simulation.on('tick', () => {
                link.attr('x1', (d: { source: { x: any; }; }) => d.source.x)
                    .attr('y1', (d: { source: { y: any; }; }) => d.source.y)
                    .attr('x2', (d: { target: { x: any; }; }) => d.target.x)
                    .attr('y2', (d: { target: { y: any; }; }) => d.target.y);
                node.attr('cx', (d: { x: any; }) => d.x)
                    .attr('cy', (d: { y: any; }) => d.y);
            });
        };
    
        return (
            <>
                <div className="header">
                    <div>
                        <label>
                            Min Degree:
                            <input type="number" value={inputMinDegree} onChange={e => setInputMinDegree(Number(e.target.value))} />
                        </label>
                        <label style={{ marginLeft: '10px' }}>
                            Max Degree:
                            <input type="number" value={inputMaxDegree} onChange={e => setInputMaxDegree(Number(e.target.value))} />
                        </label>
                        <button onClick={updateGraph} style={{ marginLeft: '10px' }}>Save</button>
                    </div>
                </div>
    
                <div className="legend">
                    <div className="blue"><span></span> związek zawodowy</div>
                    <div className="red"><span></span> spółka z ograniczoną odpowiedzialnością</div>
                    <div className="green"><span></span> stowarzyszenie</div>
                    <div className="yellow"><span></span> cech rzemieślniczy</div>
                    <div className="pink"><span></span> federacja / konfederacja związków pracodawców</div>
                    <div className="orange"><span></span> fundacja</div>
                    <div className="purple"><span></span> inna organizacja społeczna lub zawodowa</div>
                    <div className="lime"><span></span> izba gospodarcza</div>
                    <div className="aqua"><span></span> izba rzemieślnicza</div>
                    <div className="brown"><span></span> jednostka organizacyjna związku zawodowego posiadająca osobowość prawną</div>
                    <div className="indigo"><span></span> jednostka terenowa stowarzyszenia posiadająca osobowość prawną</div>
                    <div className="cadetblue"><span></span> ogólnokrajowy związek międzybranżowy</div>
                    <div className="chocolate"><span></span> ogólnokrajowe zrzeszenie międzybranżowe</div>
                    <div className="coral"><span></span> rolnicze zrzeszenie branżowe</div>
                    <div className="cornflowerblue"><span></span> polski związek sportowy</div>
                    <div className="crimson"><span></span> samodzielny publiczny zakład opieki zdrowotnej</div>
                    <div className="cyan"><span></span> spółdzielnia</div>
                    <div className="darkblue"><span></span> spółdzielcza kasa oszczędnościowo-kredytowa</div>
                    <div className="darkcyan"><span></span> spółka akcyjna</div>
                    <div className="darkgoldenrod"><span></span> spółka jawna</div>
                    <div className="darkgray"><span></span> spółka komandytowa</div>
                    <div className="darkgreen"><span></span> spółka komandytowo-akcyjna</div>
                    <div className="khaki"><span></span> spółka partnerska</div>
                    <div className="darkmagenta"><span></span> stowarzyszenie kultury fizycznej</div>
                    <div className="darkorange"><span></span> stowarzyszenie kultury fizycznej o zasięgu ogólnokrajowym</div>
                    <div className="darkorchid"><span></span> towarzystwo ubezpieczeń wzajemnych</div>
                    <div className="darkred"><span></span> zrzeszenie handlu i usług</div>
                    <div className="darkseagreen"><span></span> zrzeszenie transportu</div>
                    <div className="darkslateblue"><span></span> związek pracodawców</div>
                    <div className="darkslategray"><span></span> związek rolniczych zrzeszeń branżowych</div>
                    <div className="darkturquoise"><span></span> związek sportowy</div>
                    <div className="darkviolet"><span></span> związek stowarzyszeń</div>
                    <div className="deeppink"><span></span> związek zawodowy rolników indywidualnych</div>
                    <div className="deepskyblue"><span></span> związki rolników, kółek i organizacji rolniczych</div>
                </div>
    
                <div className="graph-count">
                    Number of Graphs: <span>{graphCount}</span>
                </div>
    
                <svg ref={svgRef} style={{ width: '100vw', height: '800px', backgroundColor: '#222' }} />
            </>
        );
    };
    
    export default FullGraph;
    