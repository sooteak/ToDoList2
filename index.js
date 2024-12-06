window.onload = function () {
    // localStorage.clear();
    showList();
    // updateActiveState();
    sortTasks();
    // document.getElementById('searchInput').addEventListener('input', searchTasks);
    // hideCheckedList();
    // 初始化页面时调用隐藏任务的函数
    // hideCheckedTasks();
    searchTasks();
};

function create() {
    document.getElementById("addList").style.display = "block";
    document.getElementById('addTitle').value = '';
    document.getElementById('addContent').value = '';
}

function save() {
    var addtitle = document.getElementById('addTitle').value;
    var addcontent = document.getElementById('addContent').value;
    var id = parseInt(localStorage.getItem('id')) || 0;

    var newTaskId = id;
    var endTime = getEndTime();
    var endTimeDate = new Date(endTime);

    // 获取月份、日期等信息
    var month = endTimeDate.getMonth() + 1;
    var date = endTimeDate.getDate();
    var year = endTimeDate.getFullYear();
    var hours = endTimeDate.getHours().toString().padStart(2, '0');
    var minutes = endTimeDate.getMinutes().toString().padStart(2, '0');
    var seconds = endTimeDate.getSeconds().toString().padStart(2, '0');
    var ampm = endTimeDate.getHours() >= 12 ? 'PM' : 'AM';

    if (addtitle.trim() === '' || addcontent.trim() === '') {
        // 如果标题或内容为空，显示警告框
        alert('标题和内容不能为空！');
        return; // 退出函数，不保存任务
    }

    // 构建包含月份等信息的对象
    var endTimeInfo = {
        month: month,
        date: date,
        year: year,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        ampm: ampm,
    };

    // 存储包含月份等信息的对象到endTime数组中
    var endTimeArray = [endTimeInfo];

    

    var list = {
        title: addtitle,
        content: addcontent,
        id: newTaskId,
        complete: false,
        endTime: endTimeArray,

    }
    // Get the existing data
    var existing = localStorage.getItem('list');
    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? JSON.parse(existing) : [];
    // Check if existing is an array, if not make it an array
    if (!Array.isArray(existing)) {
        existing = [existing];
    }
    // Add new data to localStorage Array
    existing.push(list);
    // Save back to localStorage
    localStorage.setItem('list', JSON.stringify(existing));
    localStorage.setItem('id', ++id);
    document.getElementById('addList').style = "display: none";
    showList();
    // saveActive();
    // getEndTime();
    // hideCheckedTasks();
    searchTasks();
    showOrHide();

}

function createCancel() {
    document.getElementById('addList').style = "display: none";
}

function editCancel() {
    document.getElementById('editList').style = "display: none";
}

function deleteCancel() {
    document.getElementById('deleteList').style = "display: none";
}

function showList() {

    var monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var showList = JSON.parse(localStorage.getItem('list'));
    if (showList === null) {
        console.error("showList is null");
        return;
    }

    var html = '';
    for (var i = showList.length - 1; i >= 0; i--) {
        const title = showList[i]?.title ?? '';
        var endTimeInfo = showList[i].endTime[0]; // 获取endTime对象

        // 获取endTime对象的月份属性
        var month = endTimeInfo.month;
        var date = endTimeInfo.date;
        var year = endTimeInfo.year;
        var hour = endTimeInfo.hours;
        var minute = endTimeInfo.minutes;
        var ampm = endTimeInfo.ampm;
        // var seconds = endTimeInfo.seconds;
        //

        // 获取英文月份名称
        var monthName = monthNames[month - 1];

        html += 
        `<div class="list">
        <div id='table-${showList[i].id}' class="table">
            <div class="titlePart">
                    <div class="t-checkbox" style="flex-grow: 0.5;">
                        <input type="checkbox" class="checkbox" onclick="isActive(${showList[i].id})"${showList[i].complete ? 'checked' : ''}>
                    </div>
                    <div class="t-title" style="flex-grow: 10;">
                        <p class="title">${title}</p>
                    </div>
                    <div class="t-logo" style="flex-grow: 0.5;">
                        <div class="logo">
                            <img src="edit.png" class="edit" onclick="edit(${showList[i].id})" alt="edit">
                            <img src="delete.png" class="delete" onclick="dlt(${showList[i].id})" alt="delete">
                            <img src="down.png" class="hide" id="toggle-icon-${i}" onclick="toggleContent(${i})" alt="up">
                        </div>
                    </div>
            </div> 
            
            <div class="task-content" id="task-content-${i}" style="display: none;">
            
                <div colspan="2">
                    <div class="time">
                        <p>Last Modified ${monthName} ${date} ${year} at ${hour}:${minute}${ampm}</p>
                    </div>
                    <div class="content">${showList[i]?.content ?? ''}</div>
            </div>
        </div>
    </div>`
    }
    console.log("showList is: ", showList);
    // console.log("html is: ", html);
    document.getElementById("list").innerHTML = html;

};

//show the time when create or edit
function getEndTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 注意月份是从0开始计数的，所以要加1
    const day = now.getDate().toString().padStart(2, '0');
    let hours = now.getHours() % 12; // 取12小时制
    hours = (hours === 0 ? 12 : hours).toString().padStart(2, '0'); // 如果为0，则为12小时制的12
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM'; // 判断是上午还是下午

    const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
    return timeString;


}

function isActive(id) {
    var list = JSON.parse(localStorage.getItem('list'));
    const checkboxes = document.getElementsByClassName('checkbox');

    for (var i = 0; i < checkboxes.length; i++) {
        if (list[i].id === id) {
            if (list[i].complete === false) {
                list[i].complete = true;
            } else {
                list[i].complete = false;

            }
            // console.log(list[i].complete)
        }
    }

    localStorage.setItem('list', JSON.stringify(list));
    console.log(list);
}

var currentTaskIndex = null; // 用于存储当前任务的索引

function edit(id) {
    currentTaskIndex = id;
    // 获取localStorage中的数据
    var list = JSON.parse(localStorage.getItem('list'));

    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            document.getElementById('editTitle').value = list[i].title;
            document.getElementById('editContent').value = list[i].content;
            var checkbox = document.getElementById('editCheckBox');
            checkbox.checked = list[i].complete;
            break; // 找到匹配的任务后，跳出循环
        }
    }

    document.getElementById('editList').style.display = 'block';
}

function update() {
    id = currentTaskIndex;
    if (currentTaskIndex !== null) {
        var editTitle = document.getElementById('editTitle').value;
        var editContent = document.getElementById('editContent').value;
        var editCheckBox = document.getElementById('editCheckBox').checked;
        var endTime = getEndTime();
        var endTimeDate = new Date(endTime);

        // 获取月份、日期等信息
        var month = endTimeDate.getMonth() + 1;
        var date = endTimeDate.getDate();
        var year = endTimeDate.getFullYear();
        var hours = endTimeDate.getHours().toString().padStart(2, '0');
        var minutes = endTimeDate.getMinutes().toString().padStart(2, '0');
        var seconds = endTimeDate.getSeconds().toString().padStart(2, '0');
        var ampm = endTimeDate.getHours() >= 12 ? 'PM' : 'AM';

        // 构建包含月份等信息的对象
        var endTimeInfo = {
            month: month,
            date: date,
            year: year,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            ampm: ampm,
        };

        // 存储包含月份等信息的对象到 endTime 数组中
        var endTimeArray = [endTimeInfo];
        var list = JSON.parse(localStorage.getItem('list'));

        // 删除当前任务的原始数据
        list = list.filter(function (task) {
            return task.id !== id;
        });

        // 添加新编辑的任务数据
        list.push({
            title: editTitle,
            content: editContent,
            id: currentTaskIndex,
            complete: editCheckBox,
            endTime: endTimeArray, // 使用包含月份等信息的对象的数组格式
        });

        localStorage.setItem('list', JSON.stringify(list));

        // 隐藏编辑表单
        document.getElementById('editList').style.display = 'none';

        // 重新显示任务列表
        showList();
    }
    // hideCheckedTasks();
    searchTasks();
    showOrHide();

}

var currentDeleTaskIndex = null; // 用于存储当前任务的索引

function dlt(id) {
    var list = JSON.parse(localStorage.getItem('list'));
    // 获取任务在数组中的索引
    currentDeleTaskIndex = list.findIndex(function (task) {
        return task.id === id;
    });
    console.log(currentDeleTaskIndex);
    document.getElementById('deleteList').style.display = 'block';
}

function drop() {
    if (currentDeleTaskIndex !== null) {
        var list = JSON.parse(localStorage.getItem('list'));
        // 删除指定索引位置的任务
        list.splice(currentDeleTaskIndex, 1);
        // 保存更新后的数据到 localStorage
        localStorage.setItem('list', JSON.stringify(list));

        // 隐藏编辑表单
        document.getElementById('deleteList').style.display = 'none';
        // 重新显示任务列表
        showList();
    }
    // hideCheckedTasks();
    searchTasks();
    showOrHide();


}

function toggleContent(index) {
    var contentRow = document.getElementById('task-content-' + index);
    var toggleIcon = document.getElementById('toggle-icon-' + index);

    if (contentRow && toggleIcon) {
        if (contentRow.style.display === 'none' || contentRow.style.display === '') {
            contentRow.style.display = 'block'; // 或者其他你想要的显示方式
            toggleIcon.src = 'logo/up.png'; // 切换为向上的图标
        } else {
            contentRow.style.display = 'none';
            toggleIcon.src = 'logo/down.png'; // 切换为向下的图标
        }
    }
}

// 隐藏所有已勾选的任务
function hideCheckedTasks() {
    var checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            checkbox.closest('.table').style.display = 'none'; // 隐藏已勾选的任务
        }
    });
}

// 显示所有任务
function showAllTasks() {
    var searchKeyword = document.getElementById('searchInput').value.toLowerCase();
    var divs = document.querySelectorAll('.table');

    divs.forEach(function (div) {
        var taskId = div.id.split('-')[1];
        var task = JSON.parse(localStorage.getItem('list')).find(function (task) {
            return task.id === parseInt(taskId);
        });

        var taskTitle = task.title.toLowerCase();
        var taskContent = task.content.toLowerCase();

        if (taskTitle.includes(searchKeyword) || taskContent.includes(searchKeyword)) {
            div.style.display = 'block'; // 显示匹配搜索关键字的任务
        } else {
            div.style.display = 'none'; // 隐藏不匹配搜索关键字的任务
        }
    });
}



// 切换显示/隐藏已勾选任务的状态
function toggleCheckedTasks() {
    // searchTasks();
    var showListElement = document.querySelector('.showList');
    // 获取开关元素（假设开关的类名为 'showList'）
    showListElement.classList.toggle('hide-checked');
    if (showListElement.classList.contains('hide-checked')) {
        showListElement.textContent = 'Show All List';
        hideCheckedTasks(); // 调用隐藏任务的函数
        searchTasks();
    } else {
        showListElement.textContent = 'Hide Checked List';
        showAllTasks(); // 调用显示所有任务的函数
        searchTasks();
    }

    // // 页面加载时调用隐藏任务的函数
    // hideCheckedTasks();
    // searchTasks();
    // showOrHide()

}
function sortTasks() {
    var sortBy = document.getElementById('sorts').value;
    var tasks = JSON.parse(localStorage.getItem('list'));



    if (sortBy === 'date') {
        tasks.sort(function (a, b) {
            // 将日期字符串转换为时间戳进行比较
            return new Date(a.endTime[0].year, a.endTime[0].month - 1, a.endTime[0].date, a.endTime[0].hours, a.endTime[0].minutes, a.endTime[0].seconds).getTime() -
                new Date(b.endTime[0].year, b.endTime[0].month - 1, b.endTime[0].date, b.endTime[0].hours, b.endTime[0].minutes, b.endTime[0].seconds).getTime();
        });
    } else if (sortBy === 'title') {
        tasks.sort(function (a, b) {
            return b.title.localeCompare(a.title);
        });

    } else if (sortBy === 'default') {
        // 默认按照任务的ID排列
        tasks.sort(function (a, b) {
            return a.id - b.id;
        });
    }

    // 更新排序后的任务列表到 localStorage
    localStorage.setItem('list', JSON.stringify(tasks));

    // 显示排序后的任务列表
    showList();

    // 初始化页面时调用隐藏任务的函数

    searchTasks();
    // hideCheckedTasks();
    showOrHide();

}

function searchTasks() {
    var searchKeyword = document.getElementById('searchInput').value.toLowerCase();
    var tasks = JSON.parse(localStorage.getItem('list'));

    tasks.forEach(function (task) {
        var taskTitle = task.title.toLowerCase();
        var taskContent = task.content.toLowerCase();
        var taskId = task.id;
        var taskElement = document.getElementById('table-' + taskId);
        if (taskTitle.includes(searchKeyword) || taskContent.includes(searchKeyword)) {
            // 如果任务的标题或内容包含搜索关键字，显示任务
            if (taskElement) {
                taskElement.style.display = 'block';

            }
        } else {
            // 如果任务的标题和内容都不包含搜索关键字，隐藏任务
            if (taskElement) {
                taskElement.style.display = 'none';
            }
        }
    });
    // hideCheckedTasks()
    showOrHide();
}

function showOrHide() {
    var showListElement = document.querySelector('.showList');
    var textContent = showListElement.textContent.trim();
    var isShowAllList = textContent.toLowerCase() === 'show all list';
    console.log(isShowAllList);
    if (isShowAllList) {
        hideCheckedTasks();
    } else {
        showAllTasks()
    }
}


