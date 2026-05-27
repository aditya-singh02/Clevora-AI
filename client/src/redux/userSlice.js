import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({ 
    name: 'user',
    initialState: {
        userData: null,
    },
    reducers: { //ye reducers object hai jisme hum apne state ko update karne ke liye functions define karte hain. In functions ko hum actions ke through call karte hain, aur ye functions state ko update karte hain based on the payload they receive.
        setUserData: (state, action) => {
            state.userData = action.payload; // is function ka naam setUserData hai, aur ye state ke userData property ko update karta hai with the value provided in the action's payload. Jab hum is action ko dispatch karenge, to hum payload me user data pass karenge, aur ye reducer us data ko state me store kar dega.
        }} 
})

export const { setUserData } = userSlice.actions; 

export default userSlice.reducer; 