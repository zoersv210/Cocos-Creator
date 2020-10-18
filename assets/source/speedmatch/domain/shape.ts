export default class Shape{
    index:number
    color:string




    static Colors:Array<string> = ["#FFA700", "#FF2F00","#AF308F","#0395EC",
        "#07AB0F"]

    isEqual(shape:Shape, symbolOnly:boolean):boolean{
        if(symbolOnly)
            return this.index == shape.index

        return this.index == shape.index || this.color == shape.color
    }

    constructor(index:number, color:string) {
        this.index = index
        this.color = color
    }
}
