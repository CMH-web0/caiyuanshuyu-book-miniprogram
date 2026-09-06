const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { id } = event
    
    const res = await db.collection('books').doc(id).get()
    
    return { success: true, data: res.data }
  } catch (e) {
    return { success: false, message: e.message }
  }
}
