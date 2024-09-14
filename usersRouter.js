const express = require('express');
const userDBC = require('./usersDBC');
const router = express.Router();

router.get('/getUsers', async (req, res)=>
{
    let res_get_users = 
    {
        status_code : 500,
        users : [] 
    };

    try
    {
        const rows = await userDBC.getUsers();
        res_get_users.status_code = 200;
        if(rows.length > 0)
        {
            rows.forEach((user)=>
            {
                res_get_users.users.push
                ({
                    Id : user.ID,
                    Major : user.Major,
                    Name : user.Name,
                    Time : user.Time
                });
            });
        }
        else
        {
            console.log('사용자 없음');
        }
    }
    catch(error)
    {
        console.log(error.message);
    }
    finally
    {
        //응답 
        res.json(res_get_users);
    }
});

router.post('/insertUser', async(req, res)=>{
    const res_signup = {
        status_code : 500
    };

    try{
        const {Id, Major, Name, Time} =  req.body;
        const rows = await userDBC.insertUser([Id, Major, Name, Time]);
        if(rows.affectedRows > 0){
            // 정상작동
            res_signup.status_code = 200;
        }else{
            // ERROR
            res_signup.status_code = 201;
        }
    }catch(err)
    {
        // ERROR
        console.log(err.message);
    }finally{
        res.json(res_signup);
    }
});

router.post('/deleteUser', async(req, res)=>{
    const res_delete_user = {
        status_code : 500
    };

    try{
        const {Id} =  req.body;
        const rows = await userDBC.deleteUser([Id]);
        if(rows.affectedRows > 0){
            // 정상작동
            res_delete_user.status_code = 200;
        }else{
            // ERROR
            res_delete_user.status_code = 201;
        }
    }catch(err)
    {
        // ERROR
        console.log(err.message);
    }finally{
        res.json(res_delete_user);
    }
});

router.post('/updateUser', async(req, res)=>{
    const res_update_user = {
        status_code : 500
    };

    try{
        const {Id, Major, Name, Time} =  req.body;
        const rows = await userDBC.updateUser(Id, Major, Name, Time);
        if(rows.affectedRows > 0){
            // 정상작동
            res_update_user.status_code = 200;
        }else{
            // ERROR
            res_update_user.status_code = 201;
        }
    }catch(err)
    {
        // ERROR
        console.log(err.message);
    }finally{
        res.json(res_update_user);
    }
});

module.exports = router;