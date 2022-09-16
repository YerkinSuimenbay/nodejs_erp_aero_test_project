# nodejs_erp_aero_test_project
clone the project

run "npm install"
create ".env" file
run "npx prisma migrate dev" 
finally "npm run dev"

ROUTES:
/auth/signup [POST]
/auth/signin [POST]
/auth/signin/new_token [POST]
/file/upload [POST] 
/file/list [GET]
/file/delete/:id [DELETE] 
/file/:id [GET]
/file/download/:id [GET]
/file/update/:id [PUT]
/info [GET]
/auth/logout [GET] 
