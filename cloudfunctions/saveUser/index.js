const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { openid, nickName, avatarUrl, phone } = event
    
    const res = await db.collection('users').where({ openid: openid }).get()
    
    if (res.data.length > 0) {
      const updateData = {}
      if (nickName) updateData.nickName = nickName
      if (avatarUrl) updateData.avatarUrl = avatarUrl
      if (phone) updateData.phone = phone
      
      await db.collection('users').where({ openid: openid }).update({ data: updateData })
      
      const userRes = await db.collection('users').where({ openid: openid }).get()
      return { success: true, data: userRes.data[0] }
    } else {
      const userData = {
        openid: openid,
        nickName: nickName || '用户',
        avatarUrl: avatarUrl || '',
        phone: phone || '',
        createTime: Date.now(),
        updateTime: Date.now()
      }
      
      const addRes = await db.collection('users').add({ data: userData })
      return { success: true, data: { _id: addRes._id, ...userData } }
    }
  } catch (e) {
    return { success: false, message: e.message }
  }
}
