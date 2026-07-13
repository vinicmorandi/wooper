# Deploy para ECS Fargate (manual & CI)

Este arquivo descreve dois caminhos para publicar `wooper/server` no ECS Fargate: comandos manuais com `aws` + um workflow de exemplo para GitHub Actions.

Pré-requisitos:
- Conta AWS com permissões para ECR, ECS, IAM e CloudWatch Logs.
- AWS CLI configurado localmente ou GitHub Secrets configurados: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_ACCOUNT_ID`, `ECR_REPOSITORY`, `ECS_CLUSTER`, `ECS_SERVICE`.

1) Manual (rápido):

```bash
# criar repositório ECR (se não existir)
aws ecr create-repository --repository-name wooper-server --region us-east-1 || true

# build & push
cd server
docker build -t wooper-server .
docker tag wooper-server:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/wooper-server:latest
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/wooper-server:latest

# registrar task definition
sed -e "s|<IMAGE>|${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/wooper-server:latest|g" ecs-task-def.json > task-def.json
aws ecs register-task-definition --cli-input-json file://task-def.json

# criar service (primeira vez) ou atualizar service
aws ecs create-cluster --cluster-name ${ECS_CLUSTER} || true
aws ecs create-service --cluster ${ECS_CLUSTER} --service-name ${ECS_SERVICE} --task-definition wooper-server-task --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[subnet-...],securityGroups=[sg-...],assignPublicIp=ENABLED}"

``` 

2) CI (GitHub Actions):

- Coloque o arquivo `.github/workflows/deploy-ecs.yml` (fornecido) na raiz do repositório `wooper`.
- Configure os secrets no repositório: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_ACCOUNT_ID`, `ECR_REPOSITORY`, `ECS_CLUSTER`, `ECS_SERVICE`.

Observações importantes:
- O servidor mantém estado de partidas em memória — para rodar múltiplas réplicas sem perda de partidas, migre o state para Redis/ElastiCache ou mantenha um único serviço (scaling vertical) e um ALB que direcione conexões.
- Ajuste `executionRoleArn` e `taskRoleArn` em `ecs-task-def.json` para os ARNs corretos da sua conta.
- Ajuste `awslogs-region` no `ecs-task-def.json`.
