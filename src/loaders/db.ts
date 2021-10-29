import mongoose from "mongoose";

export async function connect(uri: string) {
  
  mongoose.connect(uri, {
    autoCreate:true,
		autoIndex:true,
   })
}

export default connect