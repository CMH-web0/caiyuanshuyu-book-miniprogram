const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    const { pageNum = 1, pageSize = 10, keyword = '', category = '' } = event
    
    const conditions = [{ sold: _.neq(true) }]
    
    if (category && category !== 'all') {
      conditions.push({ category: category })
    }
    
    if (keyword) {
      conditions.push({ title: db.RegExp({ regexp: keyword, options: 'i' }) })
    }
    
    const res = await db.collection('books')
      .where(_.and(conditions))
      .orderBy('createTime', 'desc')
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .get()
      
    return { success: true, data: res.data }
  } catch (e) {
    return { success: false, message: e.message }
  }
}
