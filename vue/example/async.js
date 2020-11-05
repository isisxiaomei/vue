
console.log("aa")
async function testAsync () {
    console.log("bb")

    const res = await 222
    console.log(res);
    console.log("dd")
    return res;
}

testAsync().then(result => console.log(result));

setTimeout(() => {
    console.log("ff");
}, 5000)
console.log('cc');