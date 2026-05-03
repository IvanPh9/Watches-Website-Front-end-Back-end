class Product {
    #_id;

    constructor(id, title, price, description, image, type, material, color, quantity) {

        this._title = title;
        this._price = price;
        this._description = description;
        if (image) {
            this._image = image;
        } else {
            const safeTitle = title.replace(/\s+/g, '+');
            this._image = `https://placehold.co/300x400?text=${safeTitle}+${id}&font=roboto`;
        }
        this._type = type;
        this._material = material;
        this._color = color;
        this.#_id = id;
        this._quantity = quantity;
    }

    toJSON() {
        return {
            id: this.#_id,
            title: this._title,
            price: this._price,
            description: this._description,
            image: this._image,
            type: this._type,
            material: this._material,
            color: this._color,
            quantity: this._quantity
        }
    }

    get quantity() {
        return this._quantity;
    }

    set quantity(value) {
        this._quantity = value;
    }

    get id() {
        return this.#_id;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        if (value < 0) {
            throw new Error("Price cannot be negative.");
        }
        this._price = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get image() {
        return this._image;
    }

    set image(value) {
        this._image = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get material() {
        return this._material;
    }

    set material(value) {
        this._material = value;
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }
}

export { Product };