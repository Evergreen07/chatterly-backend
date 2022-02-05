const users = [];

const addUsers = ({id, name, room}) => {
    room = room.trim().toLowerCase();

    const existingUser = users.find(user => user.room == room && user.name == name);

    if(existingUser){
        return {
            error : 'User already present !'
        };
    }
    
    const user = { id, name, room };
    users.push(user);
    return { user };
}

const removeUsers = (id) => {
    const index = users.findIndex((user) => user.id === id);
    console.log(index);

    if(index !== -1){
        const user = users.splice(index, 1)[0];
        console.log(user)
        return user;
    }
}

const getUsers = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = ({room}) => {
    return users.filter((user) => user.room === room);
}

module.exports = {addUsers, removeUsers, getUsers, getUsersInRoom}