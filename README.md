1. Install docker
2. Run docker compose up --build
3. Turn off service nodejs (to develop)
4. Run npm install
5. CD src
6. Run npx sequelize-cli db:migrate
7. Generate sample data: npx sequelize-cli db:seed:all
8. API docs: http://localhost:3000/api-docs/#/
9. Database: http://localhost:8080/ (username root, password: 123456)
