const person = {
    firstName: 'John',
    lastName: 'Doe'
};

// 使用对象解构，设置别名
const { firstName: fName, lastName: lName } = person;

console.log(fName); // 输出: 'John'
console.log(lName); // 输出: 'Doe'
console.log(typeof(person))
