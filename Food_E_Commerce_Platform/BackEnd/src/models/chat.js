const pool = require("../config/Database");

const ActivityLogs = {
    getChat: async (body) => {
        const { CustomerID } = body
        const query = `select ch.content, ch.createAt as createChatAt, CONCAT(cu.FirstName, ' ', cu.LastName) as creator,				
                        gc.isChatBot, gc.createAt, gc.createBy, gc.questionId
                        from groupchats gc JOIN chats ch on ch.chatID = gc.chatID
                        join Customer cu on cu.CustomerID = gc.createBy
                        where gc.CustomerID = ?  and gc.status ='active'`;
        const [rs] = await pool.query(query, [CustomerID])
        return rs;
    },

    getQuestion: async (body) => {
        const { showWhen } = body
        const query = "SELECT * FROM questions WHERE status='active'";
        const [result] = await pool.query(query, [showWhen]);
        return result;
    },


    setChat: async (body) => {
        const { customerID, questionID, content, isChatBot } = body


        const TEXT_HOI_PRODUCT = [
            'gà', 'phở', 'bún', 'pizza', 'nước', 'lợn', 'bò', 'heo', 'cà phê', 'coffee', 'chè', 'thịt', 'nem', 'cơm', 'sinh tố','nước ép','mì', 'cá', 'thịt thỏ', 'thỏ', 'hủ tiếu', 'chay', 'món chay', 
            'lẩu', 'lẩu cay', 'lẩu thái', 
        ]

        const TEXT_HOI_COMBO = ['combo', 'cặp','nhóm người','nhóm', 'party']

        const answer = await pool.query(
            `SELECT a.* FROM questions q join questionanswers qa on qa.questionId = q.questionId 
            join answers a on a.answerId = qa.answerId where q.questionId = ? and a.status = 'active'`, [questionID]
        );

        const answerContent = answer?.[0]?.[0]?.content

        let groupchats = null
        let chatIDS = [0, 0]; // item 1 là chat, item2 là phản hồi tự động nếu có
        if (isChatBot) {

            let contentAuto = ''
            if (TEXT_HOI_PRODUCT.some(word => content.includes(word)) && !questionID) {
                const text = TEXT_HOI_PRODUCT.find(word => content.includes(word))
                contentAuto = `<a href="/search?keyword=${text}" style="color: white;">👩‍🍳 Có thể đây là món ăn mà anh/chị đang cần 🍴 (XEM NGAY)</a>`
            }

            if (TEXT_HOI_COMBO.some(word => content.includes(word)) && !questionID) {
                const text = TEXT_HOI_COMBO.find(word => content.includes(word))
                contentAuto = `<a href="/list-combo" style="color: white;">🧑‍🍳 Các combo món ăn mà anh/chị có thể tham khảo (XEM NGAY)</a>`
            }

            const [chat1] = await pool.query(
                "INSERT INTO chats (CustomerID, content) values (?,?)", [customerID, content]
            );
            const [chat2] = await pool.query(
                "INSERT INTO chats (CustomerID, content) values (?,?)", [customerID, contentAuto || answerContent || 'Chúng tôi sẽ phản hồi lại quý khách sớm ạ.']
            );
            chatIDS = [chat1.insertId, chat2.insertId];
            groupchats = await pool.query(
                "INSERT INTO groupchats (chatID, createBy,  isChatBot, CustomerID,questionId) values (?,?,?,?,?) ", [chatIDS[0], customerID, 'false', customerID, questionID || null]
            );

            await pool.query(
                "INSERT INTO groupchats (chatID, createBy,  isChatBot, CustomerID) values (?,?,?,?) ", [chatIDS[1], customerID, 'true', customerID]
            );

        } else {
            const [chat1] = await pool.query(
                "INSERT INTO chats (CustomerID, content) values (?,?)", [customerID, content]
            );

            chatIDS = [chat1.insertId];
            groupchats = await pool.query(
                "INSERT INTO groupchats (chatID, createBy,  isChatBot, CustomerID) values (?,?,?,?) ", [chatIDS[0], customerID, 'false', customerID]
            );
        }

        return groupchats[0];
    }

}

module.exports = ActivityLogs