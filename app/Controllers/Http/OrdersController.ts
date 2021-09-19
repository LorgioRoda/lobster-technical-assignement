import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Order from 'App/Models/Order'

export default class OrdersController {
  public async index({ view }: HttpContextContract) {
    const orders = await Order.query().preload('items')
    return await view.render('orders/index', { orders })
  }

  public async show({ view, params }: HttpContextContract) {
    const order = await Order.query().where('id', '=', params.id).preload('items').firstOrFail()
    return await view.render('orders/show/show.edge', { order })
  }

  public async update({ request, response, params, session }: HttpContextContract) {
      const orderData = await request.validate({ schema: updateOrderSchema })
      const order = await Order.findOrFail(params.id)
      order.customersName = orderData.customersName,
      order.customersPhone = orderData.customersPhone,
      order.customersEmail = orderData.customersEmail
      await order.save()
      session.flash('messageSucces', 'Your data was saved')
      return response.redirect().toRoute('OrdersController.index')
  }
}

const updateOrderSchema = schema.create({
  customersName: schema.string(),
  customersPhone: schema.string(),
  customersEmail: schema.string(),
})