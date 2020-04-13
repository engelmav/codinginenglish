const {
  Service, ServicePort, PodTemplateSpec, Container
} = require('kubernetes-models/v1');
const {
  Deployment, DeploymentSpec
} = require('kubernetes-models/extensions/v1beta1');

const argv = require('yargs')
  .usage('$0 [options]')
  .demandOption(['e'])
  .alias('e', 'environment')
  .choices('e', ['local', 'dev', 'prod'])
  .nargs('e', 1)
  .describe('e', 'loads config for the specified environment')
  .argv;


function createService(
  componentName, port, targetPort
) {
  return new Service({
    metadata: {
      name: componentName
    },
    spec: {
      selector: {
        app: componentName,
      },
      ports: [
        new ServicePort({
          protocol: "TCP",
          port: port,
          targetPort: targetPort
        })
      ]
    }
  });
}


function createLoadBalancer(
  componentName, loadBalancerIP, port, targetPort
) {
  //   const { componentName, loadBalancerIP, port, targetPort } = params;
  return new Service({
    metadata: {
      name: componentName
    },
    spec: {
      type: "LoadBalancer",
      loadBalancerIP: loadBalancerIP,
      selector: {
        app: componentName,
      },
      ports: [
        new ServicePort({
          protocol: "TCP",
          port: port,
          targetPort: targetPort
        })
      ]
    }
  });
}


function createDeployment(params) {
  const { componentName, imageName, envVars, ports, secrets } = params;
  let deployment = new Deployment({
    metadata: {
      name: componentName
    },
    spec: {
      selector: {
        matchLabels: {
          app: componentName,
        }
      },
      replicas: 1,
      template: new PodTemplateSpec({
        metadata: {
          labels: {
            app: componentName,
          }
        },
        spec: {
          containers: [
            new Container({
              name: componentName,
              image: imageName,
              env: envVars,
              ports: ports
            })
          ]
        }
      })
    }
  });
  if (secrets) {
    deployment.spec.template.spec.imagePullSecrets = [{name: secrets}]
  }
  // annoying hack (breaks the validate() method)
  deployment.apiVersion = "apps/v1";
  return deployment;
}


module.exports = {
  createDeployment,
  createLoadBalancer,
  createService,
  argv
};