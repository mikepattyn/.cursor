# Deployment profiles

| Profile | Use |
| --- | --- |
| `local-only` | Host `pnpm` / `dotnet run`. No container publish. |
| `container` | Docker Compose. Non-root, API `start` not `dev`. |
| `static` | Angular static build behind CloudFront/S3. |

Pick one profile per leaf in `scaffold.manifest.yaml`. CDK hosts the Angular app only. It does not deploy the .NET API.
