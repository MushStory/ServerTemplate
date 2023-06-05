## Description

##### 사용된 기술

- NestJS
- docker, docker-compose
- AWS
  - EC2
  - S3
  - RDS(Mysql 8)
- Nginx
- TypeORM 0.3
- Github Actions
- Jest



##### 구현 완료 기능

- blue/green 배포 방식 적용
- passport 라이브러리를 이용한 JWT 인증 기능 적용
- Typeorm 0.3을 이용한 DataSource, Custom Repository,  Database Migration 적용
- JEST를 이용한 Unit, E2E 테스트 적용
- E2E 테스트 실행시 Test Database를 자동 생성하여 기존 데이터베이스와 테스트 환경을 분리하는 기능 적용
- Winston으로 로그 캐치 및 S3 자동 백업 기능 적용
- Github Actions를 이용한 .env 파일 보안 관리, pull request 전체 테스트 기능 적용



#####  구현 예정 기능

- Github Actions를 이용하여 EC2에 서버 배포
- Unit, E2E 테스트 커버리지 보강
- Task 적용





