const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { openid, sellerOpenid, orderId, status } = event
    
    let query = db.collection('orders')
    
    if (orderId) {
      const res = await query.doc(orderId).get()
      return { success: true, data: [res.data] }
    }
    
    if (!openid && !sellerOpenid) {
      return { success: false, message: '缺少查询条件' }
    }
    
    let whereConditions = {}
    
    if (openid) {
      whereConditions.openid = openid
    }
    
    if (sellerOpenid) {
      whereConditions['sellerInfo.openid'] = sellerOpenid
    }
    
    if (status) {
      whereConditions.status = status
    }
    
    if (Object.keys(whereConditions).length > 0) {
      query = query.where(whereConditions)
    }
    
    const res = await query.orderBy('createTime', 'desc').get()
    
    return { success: true, data: res.data }
  } catch (e) {
    return { success: false, message: e.message }
  }
}
