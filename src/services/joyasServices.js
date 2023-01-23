const format = require('pg-format')
const joyasDB = require('../database/conexion')

const showJoyas = async ({ limits = 2, page = 1, order_by = 'id_ASC' }) => {
    if (limits <= 0 || isNaN(limits)) 
        throw new Error('el numero de la pagina no puede ser igual o inferior a cero')
    const [column, forma] = order_by.split('_');
    const offset = (page - 1) * limits;
    const formattedQuery = format('SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s;'
        , column,
        forma,
        limits,
        offset);
    const { rows: joyas } = await joyasDB.query(formattedQuery);
    return joyas;
}

const showJoya = async id => {
    const consulta = 'SELECT * FROM inventario WHERE id = $1;'
    const valores = [id];
    const { rows: joya } = await joyasDB.query(consulta, valores);
    return joya;
}

const filterJoyas = async ({ precio_min, precio_max, categoria, metal }) => {
    if (precio_min && isNaN(precio_min))
        throw new Error('el mínimo del precio debe ser solo números')

    if (precio_max && isNaN(precio_max))
        throw new Error('el máximo del precio debe ser solo número')

    const types = ['aros', 'anillo', 'collar']

    if (categoria && !types.includes(categoria))
        throw new Error(`no hay ${categoria}, intenta nuevamente`)

    const metalTipo = ['oro', 'plata']

    if (metal && !metalTipo.includes(metal))
        throw new Error('Solo trabajamos con oro y plata, no con ' + metal)

    let fullCommand = []
    let values = []
    let mainCommand = 'SELECT * FROM inventario'

    const addFilter = (column, comparisson, value) => {
        values.push(value)
        const { length } = fullCommand
        fullCommand.push(`${column} ${comparisson} $${length + 1}`)
    }

    if (precio_min) addFilter('precio', '>=', precio_min)
    if (precio_max) addFilter('precio', '<=', precio_max)
    if (categoria) addFilter('categoria', '=', categoria)
    if (metal) addFilter('metal', '=', metal)

    if (fullCommand.length > 0) {
        fullCommand = fullCommand.join(' AND ')
        mainCommand += ` WHERE ${fullCommand}`
    }

    const { rows: joyas } = await joyasDB.query(mainCommand, values)
    return joyas
}

const hateoas = parameter => {
    const results = parameter.map(params => (
        {
            href: `http://localhost:3000/joya/${params.id}`,
            name: params.nombre,
            category: params.categoria,
            metal: params.metal,
            price: params.precio,
            stock: params.stock
        }
    ));

    let count = 0
    results.map(cantidad => count += cantidad.stock);

    const totalJoyas = results.length;
    const stockTotal = count;
    const HATEOS = {
        totalJoyas,
        stockTotal,
        results
    };
    return HATEOS;
}

module.exports = { showJoyas, showJoya, filterJoyas, hateoas }