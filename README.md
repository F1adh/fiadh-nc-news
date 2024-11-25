# Northcoders News API

In order to run this project locally, two files must be created to contain one environmental variable each.

Start by creating the files ".env.test" and ".env.development". Inside each of these files you need to add PGDATABASE=database_name_here, where database_name_here is the name of either your test or development database. PGDATABASE should be set as your test database in ".env.test", and set as your development database in ".env.development".

Both these files should be added to .gitignore to avoid people being able to see your data.