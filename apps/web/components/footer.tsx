import React from "react";
import { FiBookOpen, FiGithub, FiLinkedin, FiMapPin } from "react-icons/fi";

export class Footer extends React.Component {
    render() {
        return (
            <footer className="fixed bottom-0 w-full text-center p-0 bg-green-300 text-blue-950">
                <div className="flex justify-center space-x-4">
                    <a
                        href="http://localhost:3002/api#/"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-amber-950"
                    >
                        <FiBookOpen className="inline" /> API Documentation
                    </a>
                    <a
                        href="https://github.com/palerique/meancacheproblem"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-amber-950"
                    >
                        <FiGithub className="inline" /> Git Repository
                    </a>
                    <a
                        href="http://localhost:8380/kiali/console/graph/namespaces/?traffic=grpc%2CgrpcRequest%2Chttp%2ChttpRequest%2Ctcp%2CtcpSent&graphType=versionedApp&namespaces=default%2Cistio-system&duration=1800&refresh=10000&layout=kiali-dagre&namespaceLayout=kiali-dagre&edges=trafficDistribution%2CtrafficRate%2Cthroughput%2CthroughputRequest%2CresponseTime%2Crt95&animation=true"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-amber-950"
                    >
                        <FiMapPin className="inline" /> Kiali
                    </a>
                    <a
                        href="https://www.linkedin.com/in/palerique/"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-amber-950"
                    >
                        <FiLinkedin className="inline" /> Find me on LinkedIn
                    </a>
                </div>
            </footer>
        );
    }
}
