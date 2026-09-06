const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { id, status } = event
    
    await db.collection('orders').doc(id).update({
      data: {
        status: status,
        updateTime: Date.now()
      }
    })
    
    const res = await db.collection('orders').doc(id).get()
    
    return { success: true, data: res.data }
  } catch (e) {
    return { success: false, message: e.message }
  }
}
