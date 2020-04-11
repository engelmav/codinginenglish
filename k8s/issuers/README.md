From from cert-manager docs,

> Issuers (and ClusterIssuers) represent a certificate authority from which signed x509 certificates can be obtained, such as Let’s Encrypt. You will need at least one Issuer or ClusterIssuer in order to begin issuing certificates within your cluster.

[cert-manager docs](https://docs.cert-manager.io/en/release-0.11/reference/issuers.html)

Note: prior to `kubectl apply`, add real email address to `email` key inside these `issuer` configs.
