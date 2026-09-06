const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { bookId } = event
    
    const bookRes = await db.collection('books').doc(bookId).get()
    if (!bookRes.data || bookRes.data.sold) {
      return { success: false, message: '书籍已被购买或不存在' }
    }
    
    const orderData = {
      ...event,
      orderNo: 'ORD' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase(),
      createTime: Date.now(),
      updateTime: Date.now(),
      status: 'pending'
    }
    
    const orderRes = await db.collection('orders').add({ data: orderData })
    
    await db.collection('books').doc(bookId).update({
      data: { sold: true, updateTime: Date.now() }
    })
    
    return { success: true, orderId: orderRes._id, data: { _id: orderRes._id, ...orderData } }
  } catch (e) {
    return { success: false, message: e.message }
  }
}
