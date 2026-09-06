const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const bookData = {
      ...event,
      createTime: Date.now(),
      updateTime: Date.now(),
      sold: false
    }
    
    const res = await db.collection('books').add({ data: bookData })
    
    return { success: true, data: { _id: res._id, ...bookData } }
  } catch (e) {
    return { success: false, message: e.message }
  }
}
