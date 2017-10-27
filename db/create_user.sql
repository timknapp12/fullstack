insert into users 
(username, email, image, auth_id)
values ($1, $2, $3, $4)
returning *;