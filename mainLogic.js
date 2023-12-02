//post reqwest

function createNewPostClicked(){
    let postId = document.getElementById("post-id-input").value;
    let isCreate = postId == null || postId == ""
    
    
    const title = document.getElementById("title-post-input").value
    const body = document.getElementById("body-post-input").value
    const image = document.getElementById("image-post-input").files[0]
    const token = localStorage.getItem("token")

    let formData = new FormData()
    formData.append("title",title)
    formData.append("body",body)
    formData.append("image",image)

    let url = ``
    const headers = {
        "authorization": `Bearer ${token}`
    }
    if(isCreate){
        url = 'https://tarmeezacademy.com/api/v1/posts'

     
    }else {
        formData.append("_method", "put")
        url = `https://tarmeezacademy.com/api/v1/posts/${postId}`

        
    }
    toggleLoader(true)
    axios.post(url,formData, {
        headers: headers
    })
    .then((response) => {
        // Hide the modal 
        const modal = document.getElementById("add-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        // ///// Hide the modal 
        showAlert("New Post Has Been Created",'success')
        getPosts()

    }).catch((error) => {
        const message = error.response.data.message;
        showAlert(message,'danger')
        
    }).finally(()=> {
        toggleLoader(false)
    })
   
    
}


function editPostBtnClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    //console.log(post)
    
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-modal-submit-btn").innerHTML = "Update"
    document.getElementById("title-post-input").innerHTML = post.title
    document.getElementById("body-post-input").innerHTML = post.body
    let postModal = new bootstrap.Modal(document.getElementById("add-post-modal"), {})
    postModal.toggle()
}

function deletePostBtnClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    //console.log(post)
    document.getElementById("delete-post-id-input").value=post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModal.toggle()

}

function confirmPostDelete(){
        const token = localStorage.getItem("token")
        const postId = document.getElementById("delete-post-id-input").value 
        const headers = {
            "authorization": `Bearer ${token}`
        }
        //alert(postId) 
        axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`,{
            headers: headers
        })
        .then((response) =>{
            const modal = document.getElementById("delete-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("The post has been deleted successfully ",'success')
            getPosts()
         }).catch((error) => {
            const message = error.response.data.message;
            showAlert(message,'danger')
            
        })
}


function profileClicked(){
    const user = getCurrentUser()
    const userId = user.id 
    window.location = `profile.html?userid=${userId}`
}



function setupUI(){
    const token = localStorage.getItem("token")
    const loginDiv = document.getElementById("login-div")
    const logoutDiv = document.getElementById("logout-div")
    const addBtn = document.getElementById("add-btn")
if(token == null) //user not login
{
    if(addBtn != null){
        addBtn.style.setProperty("display","none","important")
    }
    loginDiv.style.setProperty("display","block")
    logoutDiv.style.setProperty("display","none","important")
}else{
    if(addBtn != null){
        addBtn.style.setProperty("display","block")
    }
    loginDiv.style.setProperty("display","none","important")
    logoutDiv.style.setProperty("display","block")
    const user = getCurrentUser()
    document.getElementById("nav-username").innerHTML = user.username
    document.getElementById("nav-user-image").src = user.profile_image

}
} 
////auth
// login function 
function loginBtnClicked()
    {
        const username = document.getElementById("username-input").value
        const password = document.getElementById("password-input").value
        const params ={
            "username":username,
            "password":password
        }   
        toggleLoader(true) 
        axios.post("https://tarmeezacademy.com/api/v1/login",params)
        .then((response) =>{
            toggleLoader(false)
            localStorage.setItem("token",response.data.token)
            localStorage.setItem("user",JSON.stringify(response.data.user))
            // Hide the modal 
            const modal = document.getElementById("login-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
           ///// Hide the modal 
           showAlert(" login successfully",'success')
           setupUI()
         }).catch((error) => {
            const message = error.response.data.message;
            showAlert(message,'danger')
        }).finally(()=> {
            toggleLoader(false)
        })
    } 
    // //login function

    function toggleLoader(show = true){
        if(show){
            document.getElementById("loader").style.visibility = 'visible'
        }else{
            document.getElementById("loader").style.visibility = 'hidden'
            
        }
    }

    //register
function registerBtnClicked ()
    {
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value
        const name = document.getElementById("name").value
        const image = document.getElementById("profile-image").files[0]
        let formData = new FormData()
        formData.append("username",username)
        formData.append("name",name)
        formData.append("password",password)
        formData.append("image",image)
        // const params = {
                //     "username": username ,
                //     "password": password ,
                //     "name": name
                // }

        const headers = {
            "Content-Type": "multipart/form-data"
        }
        toggleLoader(true)
        axios.post("https://tarmeezacademy.com/api/v1/register", formData, {
            headers : headers
        })
        .then((response) =>{
            console.log(response.data)
            localStorage.setItem("token",response.data.token)
            localStorage.setItem("user",JSON.stringify(response.data.user))

            // hide modal 
            const modal = document.getElementById("register-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            // hide modal
            showAlert("New User Registertion Successfully",'success')
            setupUI()
        }).catch((error) => {
            const message = error.response.data.message;
            showAlert(message,'danger')
            
        }).finally(()=> {
            toggleLoader(false)
        })
    }
    /////register
    // logout
function logout()
    {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setupUI()
        showAlert(" logged out successfully",'success')
    }
    // logout
    ///auth

    ///// alert 
function showAlert(message,type='success')
    {
        const alertPlaceholder = document.getElementById('success-alert')
        const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
                `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                `   <div>${message}</div>`,
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                '</div>'
        ].join('')
    
        alertPlaceholder.append(wrapper)
        }
            appendAlert(message, type)
                    //hide alert
        setTimeout(()=>{
             //todo      // const alert = bootstrap.Alert.getOrCreateInstance('#success-alert')
                    //alert.close()  
            },2000)    
                
    }
    ////////// alert
function getCurrentUser()
    {
        let user = null
        const storageUser = localStorage.getItem("user")

        if(storageUser != null){
            user = JSON.parse(storageUser)
        }
        return user
    }