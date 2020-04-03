const {
  Service, ServicePort, PodTemplateSpec, Container
} = require('kubernetes-models/v1');
const {
  Deployment, DeploymentSpec
} = require('kubernetes-models/extensions/v1beta1');


function createLoadBalancer(
  componentName, tier, loadBalancerIP, port, targetPort
) {
  return new Service({
    metadata: {
      name: componentName
    },
    spec: {
      type: "LoadBalancer",
      loadBalancerIP: loadBalancerIP,
      selector: {
        app: componentName,
        tier: tier
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


function createDeployment(
  componentName, tier, track, imageName, envVars, ports
) {
  let deployment = new Deployment({
    metadata: {
      name: componentName
    },
    spec: {
      selector: {
        matchLabels: {
          app: componentName,
          tier: tier,
          track: track
        }
      },
      replicas: 1,
      template: new PodTemplateSpec({
        metadata: {
          labels: {
            app: componentName,
            tier: "backend",
            track: "stable"
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
  // annoying hack (breaks the validate() method)
  deployment.apiVersion = "apps/v1";
  return deployment;
}


module.exports = {
  createLoadBalancer,
  createDeployment
};