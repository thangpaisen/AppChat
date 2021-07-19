const initialData= {
    data:null,
    loading:false,
}

const user = (state =initialData,action)=>{
    switch(action.type){
        case 'SET_USER':
            return {
                ...state,
                data:action.payload,
            }
        case 'LOGIN_USER_LOADING':
            return {
                ...state,
                loading:true,
            }
        case 'LOGIN_USER_SUCCESS':
            return {
                 ...state,
                loading:false,
            }
        
        // case 'LOGOUT_USER':

        //     return {
        //         ...state,
        //     }
        default:
            return state;
        
    }
}

export default user;