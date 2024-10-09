import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Todo Test", function () {

    const todoList1 = {
        title: "Feed the Dogs",
        desc: "Feed them Akamu",
        status: 1
    }

    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    async function deployTodoFixture(){

      
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const Todo = await hre.ethers.getContractFactory("TodoList");
        const todo = await Todo.deploy();

        return {todo, owner, otherAccount}
    }

    

    describe("deployment", () => {
        it("should check if it deployed", async function () {
            const {todo, owner} = await loadFixture(deployTodoFixture);

            expect(await todo.owner()).to.equal(owner);
        });
    })


    describe("Authorization", () => {
        it("should not be able to create Todo if not the owner", async function(){
            const {todo, otherAccount} = await loadFixture(deployTodoFixture);
    
           
    
           await expect(
            todo.connect(otherAccount).createTodo(todoList1.title,todoList1.desc)
    
           ).to.be.revertedWith("You're not allowed");
        })
        it("should not be able to delete Todo if not the owner", async function(){
            const {todo, otherAccount} = await loadFixture(deployTodoFixture);
    
            
    
           await expect(
            
            todo.connect(otherAccount).comotTodo(0)
          
    
           ).to.be.revertedWith("You're not allowed");
        })
    
        it("should not be able to update Todo if not the owner", async function(){
            const {todo, otherAccount} = await loadFixture(deployTodoFixture);
    
            
    
           await expect(
            
          
            todo.connect(otherAccount).updateTodo(0, "Feed Cats", "Feed them beans")
    
           ).to.be.revertedWith("You're not allowed");
        })
    })

    describe("Address 0 Test", () => {

        it("Address Zero should not be able to create todo list", async function(){
            const {todo, owner} = await loadFixture(deployTodoFixture);

            
            await expect(
                todo.connect(ZERO_ADDRESS).createTodo(todoList1.title, todoList1.desc)
            ).to.be.revertedWith("Zero address not allowed");
        })

    })


    it("should be able to create todo list", async function(){
        const {todo, owner} = await loadFixture(deployTodoFixture);


        await todo.connect(owner).createTodo(todoList1.title,todoList1.desc)

        expect(await todo.getTodo(0)).deep.equal([todoList1.title,todoList1.desc,todoList1.status.toString()]);
    })

    it("should be able to delete todo list", async function(){
        const {todo, owner} = await loadFixture(deployTodoFixture);
        await todo.connect(owner).createTodo(todoList1.title, todoList1.desc);


        await todo.connect(owner).comotTodo(0)

        expect(await todo.getAllTodo()).to.be.empty;
    })

    it("should be able to update todo list", async function(){
        const {todo, owner} = await loadFixture(deployTodoFixture);
        const updatedTodo = {
            title: "Feed the Cats",
            desc: "Feed them beans",
            status: 2
        }

        await todo.connect(owner).createTodo(todoList1.title, todoList1.desc);


        await todo.connect(owner).updateTodo(0, updatedTodo.title, updatedTodo.desc);

        expect(await todo.getTodo(0)).deep.equal([updatedTodo.title,updatedTodo.desc,updatedTodo.status.toString()]);
    })

    it("Todo Status should be updated to done", async function(){
        const {todo, owner} = await loadFixture(deployTodoFixture);
        

        await todo.connect(owner).createTodo(todoList1.title, todoList1.desc);


        await todo.connect(owner).todoDonDo(0);

        expect(await todo.getTodo(0)).deep.equal([todoList1.title,todoList1.desc,"3"]);
    })

    it("To be able to get all lists", async function(){
        const {todo, owner} = await loadFixture(deployTodoFixture);
        
        await todo.connect(owner).getAllTodo();

        expect(await todo.getAllTodo()).deep.equal([]);
    })

    it("To be able to get a list", async function(){
        const {todo, owner} = await loadFixture(deployTodoFixture);
        

        await todo.connect(owner).createTodo(todoList1.title, todoList1.desc);


        await todo.connect(owner).getTodo(0);

        expect(await todo.getAllTodo()).deep.equal([[
            todoList1.title,
            todoList1.desc,
            todoList1.status.toString()
        ]]);
    })

    

   


})