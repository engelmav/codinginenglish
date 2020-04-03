#! /usr/bin/node

const { Service, ServicePort, PodTemplateSpec, Container } = require('kubernetes-models/v1');
const { Deployment, DeploymentSpec } = require('kubernetes-models/extensions/v1beta1')
const YAML = require('json-to-pretty-yaml');
const argv = require('yargs').argv;


const deploy_env = argv.env;
const COMPONENT_NAME = "cie-api";

let apiSvc = new Service({
    metadata: {
        name: COMPONENT_NAME
    },
    spec: {
        selector: {
            app: COMPONENT_NAME,
            tier: "backend"
        },
        ports: [
            new ServicePort({
                protocol: "TCP",
                port: 80,
                targetPort: "http"
            })
        ]
    }
});

let apiDeploy = new Deployment({
    metadata: {
        name: COMPONENT_NAME
    },
    spec: {
        selector: {
            matchLabels: {
                app: COMPONENT_NAME,
                tier: "backend",
                track: "stable"
            }
        },
        replicas: 1,
        template: new PodTemplateSpec({
            metadata: {
                labels: {
                    app: COMPONENT_NAME,
                    tier: "backend",
                    track: "stable"
                }
            },
            spec: {
                containers: [
                    new Container({
                        name: COMPONENT_NAME,
                        image: "vengelmann/cie-api",
                        env: [{ name: "CIE_ENV", value: deploy_env }],
                        ports: [{ name: "http", containerPort: 80 }]
                    })
                ]
            }
        })
    }
});
apiDeploy.apiVersion = "apps/v1";



const svcYml = YAML.stringify(apiSvc);
apiSvc.validate();
console.log(svcYml);

console.log("---")
const deployYml = YAML.stringify(apiDeploy);
// apiDeploy.validate();
console.log(deployYml);



