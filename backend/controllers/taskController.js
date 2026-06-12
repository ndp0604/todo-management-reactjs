const db = require('../config/db');

// 1. Tạo Task mới (Tự động ép trạng thái ban đầu về chữ hoa 'TODO')
exports.createTask = async (req, res) => {
    try {
        const { Title, Description, ProjectId, AssignedTo } = req.body;
        
        // Kiểm tra tính toàn vẹn của dữ liệu bắt buộc đầu vào
        if (!Title || !ProjectId || !AssignedTo) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ Title, ProjectId và AssignedTo!' });
        }

        // Ép cứng giá trị trạng thái đồng bộ với bộ lọc t.Status === 'TODO' trên React
        const Status = 'TODO'; 

        const query = `
            INSERT INTO tasks (Title, Description, ProjectId, AssignedTo, Status) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        // Thực thi câu lệnh tương tác cơ sở dữ liệu
        const [result] = await db.execute(query, [Title, Description || null, ProjectId, AssignedTo, Status]);
        
        return res.status(201).json({ 
            message: 'Tạo task thành công', 
            TaskId: result.insertId 
        });
    } catch (error) {
        console.error("❌ Lỗi thực thi tại hàm createTask:", error.message);
        return res.status(500).json({ error: `Backend Error: ${error.message}` });
    }
};

// 2. Cập nhật thông tin, trạng thái & Phân công lại task
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params; 
        const { Title, Description, Status, AssignedTo } = req.body;
        
        // Đảm bảo trạng thái chuyển lên luôn được viết hoa chuẩn Kanban (TODO, IN_PROGRESS, DONE)
        const sanitizedStatus = Status ? Status.toUpperCase() : 'TODO';

        const query = `
            UPDATE tasks 
            SET Title = ?, Description = ?, Status = ?, AssignedTo = ? 
            WHERE TaskId = ?
        `;
        
        await db.execute(query, [Title, Description || null, sanitizedStatus, AssignedTo, id]);
        
        return res.status(200).json({ message: 'Cập nhật task thành công!' });
    } catch (error) {
        console.error("❌ Lỗi thực thi tại hàm updateTask:", error.message);
        return res.status(500).json({ error: `Backend Error: ${error.message}` });
    }
};

// 3. Lấy danh sách task theo ProjectId kèm tên người làm (Đã xử lý an toàn dữ liệu)
exports.getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        // Câu lệnh truy vấn JOIN bảng, loại bỏ ORDER BY CreatedAt nếu bảng không có trường này
        const query = `
            SELECT t.*, u.Username as AssignedUserName 
            FROM tasks t 
            LEFT JOIN users u ON t.AssignedTo = u.UserId 
            WHERE t.ProjectId = ?
        `;
        
        const [rows] = await db.execute(query, [projectId]);
        
        // Chuẩn hóa thuộc tính 'Status' trả về luôn viết hoa, phòng trường hợp DB lưu chữ thường
        const formattedTasks = (rows || []).map(task => {
            // Tìm kiếm linh hoạt thuộc tính Status bất kể viết hoa hay viết thường trong DB
            const rawStatus = task.Status || task.status || 'TODO';
            return {
                ...task,
                Status: rawStatus.toUpperCase() // Đảm bảo luôn trả về 'TODO', 'IN_PROGRESS', hoặc 'DONE'
            };
        });
        
        return res.status(200).json(formattedTasks);
    } catch (error) {
        console.error("❌ Lỗi thực thi tại hàm getTasksByProject:", error.message);
        // Trả về mảng rỗng thay vì làm sập API, giúp giao diện React không bị crash màn hình trắng
        return res.status(200).json([]); 
    }
};

// 4. Xóa Task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        
        await db.execute('DELETE FROM tasks WHERE TaskId = ?', [id]);
        
        return res.status(200).json({ message: 'Xóa task thành công!' });
    } catch (error) {
        console.error("❌ Lỗi thực thi tại hàm deleteTask:", error.message);
        return res.status(500).json({ error: `Backend Error: ${error.message}` });
    }
};