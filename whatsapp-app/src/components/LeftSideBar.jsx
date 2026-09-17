import React from "react";
import Navigation from "./Nav";
import Notification from "./Notification";
import SearchBar from "./searchBar";
import UserList from "./UserList";
const LeftSideBar = () => {


    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        const arr = [];
        document.querySelectorAll(".find_user").forEach((item, index) => {
            const user_name = item.querySelector(".user_search").textContent.toLowerCase().trim();
            arr.push([index, user_name]);
        })
        setData(arr);

    }, [])


    //   console.log(data);
    const handleChange = (e) => {
        if (data.length === 0) { return; }
        if (e.target.value.trim() === '') {

            document.querySelectorAll(".find_user").forEach((item, index) => {
                item.style.display = "";
            });




            return;
        }
        const search = e.target.value.toLowerCase().trimStart();
        for (let [key, value] of data) {
            let boolean = false;
            const div_user = document.querySelectorAll(".find_user")[key];
            if (value.indexOf(search) >= 0) {
                boolean = true;
            }
            div_user.style.display = (boolean) ? "" : "none";
        }
    }

    return (


        <div className="contacts">

            {/*-------------------for navigation-------------*/}
            {<Navigation />}
            {/*---------for notification--------------*/}
            <Notification />
            {/*---------for search--------------*/}
            <SearchBar handleChange={handleChange} />
            {/*---------for user list--------------*/}
            <UserList />


        </div>



    )



}


export default LeftSideBar;