import mongoose from 'mongoose';
import { Order, OrderItem } from '../models/v1/order';
import { OrderStatus } from '../common/types/order-types';

export async function findPendingOrderItemsForDepartment(departmentId: string) {
  try {
    // Find orders where status is pending
    const pendingOrders = await Order.find({
      'items.status': OrderStatus.Pending,
    })
      .populate(['patient', 'staff'])

      .populate({
        path: 'items.service',
        match: { department: departmentId }, // Match services in the specific department
      })
      .exec();

    // Filter order items to only include pending items
    const pendingOrderItems: OrderItem[] = pendingOrders.reduce(
      (accumulator: OrderItem[], order) => {
        const pendingItemsInOrder = order.items.filter(
          (item) => item.status === 'Pending'
        );
        const pendingItemsInOrderWithPatientInfo: OrderItem[] =
          pendingItemsInOrder.map((orderItem) => ({
            ...orderItem.toJSON(),
            patient: order.patient,
            staff: order.staff,
            date: order.createdAt,
          }));
        return accumulator.concat(pendingItemsInOrderWithPatientInfo);
      },
      []
    );

    return pendingOrderItems;
  } catch (error) {
    console.error('Error finding pending order items:', error);
    throw error;
  }
}

export async function findMyPendingTask(
  staffId: string,
  departmentId: string | undefined = undefined
) {
  try {
    // Find orders where status is pending
    const pendingOrders = await Order.find({
      'items.status': OrderStatus['In Progress'],
      'items.servedBy': staffId,
    })
      .populate(['patient', 'staff'])
      .populate({
        path: 'items.service',
        //match: { department: departmentId }, // Match services in the specific department
      })

      .exec();

    // Filter order items to only include pending items
    const pendingOrderItems: OrderItem[] = pendingOrders.reduce(
      (accumulator: OrderItem[], order) => {
        const pendingItemsInOrder = order.items.filter(
          (item) => item.status === OrderStatus['In Progress']
        );
        const pendingItemsInOrderWithPatientInfo: OrderItem[] =
          pendingItemsInOrder.map((orderItem) => ({
            ...orderItem.toJSON(),
            patient: order.patient,
            staff: order.staff,
            date: order.createdAt,
          }));
        return accumulator.concat(pendingItemsInOrderWithPatientInfo);
      },
      []
    );

    return pendingOrderItems;
  } catch (error) {
    console.error('Error finding pending order items:', error);
    throw error;
  }
}
export async function updateOrderItemStatus(
  itemId: string,
  staffId: string,
  status: string
) {
  try {
    // Find the order that contains the item with the provided itemId
    const order = await Order.findOne({
      'items._id': new mongoose.Types.ObjectId(itemId),
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Find the index of the order item with the provided ID
    const itemIndex = order.items.findIndex(
      (item) => item._id.toString() === itemId
    );
    console.log('', itemId);
    console.log(order);

    if (itemIndex === -1) {
      throw new Error('Order item not found');
    }

    // Update the status of the order item to "In Progress"
    order.items[itemIndex].status = status;
    order.items[itemIndex].servedBy = staffId;

    // Save the updated order document
    await order.save();

    return order;
  } catch (error) {
    console.error('Error updating order item status:', error);
    throw error;
  }
}
// export async function findPendingOrderItemsForDepartment(departmentId: string) {
//   try {
//     // Find orders where status is pending and populate patient and service
//     const pendingOrders = await Order.find({ 'items.status': 'Pending' })
//       .populate('patient')
//       .populate({
//         path: 'items.service',
//         match: { department: departmentId },
//       })
//       .exec();

//     // Extract pending order items with patient information
//     const pendingOrderItems: OrderItem[] = [];

//     pendingOrders.forEach((order) => {
//       order.items.forEach((item) => {
//         if (item.status === 'Pending') {
//           pendingOrderItems.push({
//             ...item,
//             patient: order.patient, // Include patient information
//           });
//         }
//       });
//     });

//     return pendingOrderItems;
//   } catch (error) {
//     console.error('Error finding pending order items:', error);
//     throw error;
//   }
// }

// export async function findPendingOrderItemsForDepartment(departmentId: string) {
//     try {
//       // Find orders where status is pending
//       const pendingOrders = await Order.find({ 'items.status': 'Pending' })
//         .populate({
//           path: 'items.service',
//           match: { department: departmentId }, // Match services in the specific department
//         })
//         .populate({
//           path: 'patient', // Populate the patient field
//           select: 'name age gender', // Select the fields you want to populate
//         })
//         .exec();

//       // Initialize an empty array to store pending order items with patient information
//       const pendingOrderItemsWithPatientInfo: { orderItem: OrderItem, patientInfo: any }[] = [];

//       // Iterate through each pending order
//       pendingOrders.forEach(order => {
//         // Filter order items to only include pending items
//         const pendingItemsInOrder = order.items.filter(item => item.status === 'Pending');

//         // Iterate through each pending item in the order
//         pendingItemsInOrder.forEach(pendingItem => {
//           // Push each pending item along with patient information into the array
//           pendingOrderItemsWithPatientInfo.push({
//             orderItem: pendingItem,
//             patientInfo: order.patient // Patient information associated with the order
//           });
//         });
//       });

//       return pendingOrderItemsWithPatientInfo;
//     } catch (error) {
//       console.error('Error finding pending order items:', error);
//       throw error;
//     }
//   }
