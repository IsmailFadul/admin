import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get("/api/orders").then((response) => {
            setOrders(response.data);
        });
    }, []);

    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                {orders.length > 0 &&
                    orders?.map((order) => (
                        <tbody key={order._id}>
                            <tr>
                                <td>
                                    <td>
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>

                                </td>
                                <td>
                                    {order.name} {order.email}
                                    <br />
                                    {order.city} {order.streetAddress}
                                    {order.address}
                                </td>
                                <td>
                                    {order.line_items?.map((l) => (
                                        <div key={index}>
                                            {l.price_data.product_data?.name} *{l.quantity}
                                            <br />
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        </tbody>
                    ))}

            </table>
        </Layout>
    );
}
