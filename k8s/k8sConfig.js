#! /usr/bin/node

const { Service, ServicePort, PodTemplateSpec, Container } = require('kubernetes-models/v1');
const { Deployment, DeploymentSpec } = require('kubernetes-models/extensions/v1beta1')
const YAML = require('json-to-pretty-yaml');
const argv = require('yargs').argv;


const deployEnv = argv.env;
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
apiSvc.validate();


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
                        env: [{ name: "CIE_ENV", value: deployEnv }],
                        ports: [{ name: "http", containerPort: 80 }]
                    })
                ]
            }
        })
    }
});
// annoying hack
apiDeploy.apiVersion = "apps/v1";
// the below fails because ofbecause of
// aforementioned annoying hack:
// apiDeploy.validate();


const svcYml = YAML.stringify(apiSvc);
console.log(svcYml);
console.log("---")
const deployYml = YAML.stringify(apiDeploy);
console.log(deployYml);


