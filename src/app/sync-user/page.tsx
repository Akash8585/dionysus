//To save the clerk db in our db

import { db } from '@/server/db'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'


const SyncUser = async () => {
  const  { userId }  = await auth() //getting the userId from the clerk
  //if there is no user id throw Error
  if (!userId) { 
    throw new Error('User not found') 
  } 
  const client = await clerkClient() //getting the clerk client
  const user = await client.users.getUser(userId) //geting the user details from the clerk client

  //if there is no email adress throw error
  if (!user.emailAddresses[0]?.emailAddress) {
    return notFound()
  }


  //save the information in our own db
  //upsert = is a user exist update the data or create for the new user 
  await db.user.upsert({
    //check for the email
    where: {
      emailAddress: user.emailAddresses[0].emailAddress ?? ""
    },
    //if exists update the db
    update: {
      imageUrl : user.imageUrl,
      firstName : user.firstName,
      lastName : user.lastName,
    },
    //if  not create the bd
    create: {
      id: userId,
      emailAddress: user.emailAddresses[0].emailAddress ?? "",
      imageUrl : user.imageUrl,
      firstName : user.firstName,
      lastName : user.lastName,
    },

})
  return redirect('/dashboard') //redirecting them to the dashboard after it
}

export default SyncUser