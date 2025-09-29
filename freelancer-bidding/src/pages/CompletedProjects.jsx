import React, { useState, useEffect } from "react"; // ✅ Add useEffect
import loadRazorpayScript from "../utils/loadRazorpayScript";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import {
  selectAllApplications,
  fetchApplicationsByHiringPerson,
} from "../store/slices/applicationSlice";
import {
  createPaymentOrder,
  markPaymentSuccess,
} from "../store/slices/paymentSlice";
import { requestCorrection } from "../store/slices/quotationSlice";

const CompletedProjects = () => {
  const [paidApplications, setPaidApplications] = useState([]);
  const [correctionData, setCorrectionData] = useState({
    open: false,
    app: null,
    message: "",
  });

  const dispatch = useDispatch();
  const applications = useSelector(selectAllApplications);
  const { user } = useSelector((state) => state.auth);
  const { sentPayments } = useSelector((state) => state.payment);

  useEffect(() => {
    if (user?.role === "hiringperson") {
      dispatch(fetchApplicationsByHiringPerson());
    }
  }, [dispatch, user]);

  const handlePay = async (app) => {
    const res = await dispatch(
      createPaymentOrder({
        amount: app.bidAmount || 100,
        jobId: app.jobId?._id,
        paidTo: app.userId?._id,
      })
    );

    if (!res.payload) {
      console.error("Payment creation failed:", res.error?.message);
      alert("Failed to create Razorpay order");
      return;
    }

    const { orderId, amount, currency, jobId, paidTo } = res.payload;

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: "rzp_test_HnpMhDOhL0dI1d",
      amount: amount.toString(),
      currency,
      order_id: orderId,
      name: "Freelancer Platform",
      description: "Pay for completed project",
      handler: async (response) => {
        const paymentData = {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          amount,
          jobId,
          quotationId: app._id,
          paidBy: user._id,
          paidTo,
        };

        await dispatch(markPaymentSuccess(paymentData));
        setPaidApplications((prev) => [...prev, app._id]);
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      {applications
        .filter((app) => app.submission?.link)
        .map((app) => (
          <div
            key={app._id}
            className="bg-gray-100 p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="text-lg font-semibold">
              {app.jobId?.title || "No Title"}
            </h3>
            <p>
              Job Seeker: {app.userId?.name || "Unknown"} | Status:{" "}
              <span className="capitalize font-semibold">{app.status}</span>
            </p>
            <p className="text-sm text-gray-700 mt-1">
              💰 Pay: <span className="font-semibold">₹{app.bidAmount}</span>
            </p>
            <p className="mb-2">Proposal: {app.message}</p>

            {/* ✅ Submission Section */}
            <div className="mt-2 bg-white p-3 border rounded">
              <p className="font-semibold text-gray-700">🔗 Submitted Work:</p>
              <p>
                Link:{" "}
                <a
                  href={app.submission.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {app.submission.link}
                </a>
              </p>
              <p className="text-sm mt-1 text-gray-800">
                Message: {app.submission.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Submitted at:{" "}
                {new Date(app.submission.submittedAt).toLocaleString()}
              </p>
            </div>

            {/* ✅ Action Buttons */}
            <div className="flex gap-3 mt-3">
              <button
                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                onClick={() =>
                  setCorrectionData({
                    open: true,
                    app,
                    message: "",
                  })
                }
              >
                Request Correction
              </button>

              {sentPayments.some((p) => p.quotationId === app._id) ? (
                <button
                  disabled
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm cursor-not-allowed"
                >
                  Paid
                </button>
              ) : (
                <button
                  onClick={() => handlePay(app)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Pay
                </button>
              )}
            </div>
          </div>
        ))}

      {/* ✅ Correction Modal */}
      <Modal
        isOpen={correctionData.open}
        onClose={() =>
          setCorrectionData({ open: false, app: null, message: "" })
        }
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Request Correction</h2>
          <textarea
            rows={4}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Explain the required changes..."
            value={correctionData.message}
            onChange={(e) =>
              setCorrectionData((prev) => ({
                ...prev,
                message: e.target.value,
              }))
            }
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              className="bg-gray-300 px-4 py-1 rounded"
              onClick={() =>
                setCorrectionData({ open: false, app: null, message: "" })
              }
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded"
              onClick={async () => {
                if (!correctionData.message.trim()) {
                  toast.error("Please enter a correction message");
                  return;
                }

                try {
                  await dispatch(
                    requestCorrection({
                      quotationId: correctionData.app._id,
                      message: correctionData.message,
                    })
                  ).unwrap();

                  toast.success("Correction request sent");
                  setCorrectionData({ open: false, app: null, message: "" });
                } catch (err) {
                  console.error("Correction request failed:", err);
                  toast.error(
                    typeof err === "string"
                      ? err
                      : "Failed to send correction request"
                  );
                }
              }}
            >
              Send Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompletedProjects;


// import React, { useState, useEffect } from "react"; // ✅ Add useEffect
// import loadRazorpayScript from "../utils/loadRazorpayScript";
// import { useSelector, useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import Modal from "../components/Modal";
// import {
//   selectAllApplications,
//   fetchApplicationsByHiringPerson,
// } from "../store/slices/applicationSlice";
// import {
//   createPaymentOrder,
//   markPaymentSuccess,
// } from "../store/slices/paymentSlice";
// import { requestCorrection } from "../store/slices/quotationSlice";

// const CompletedProjects = () => {
//   const [paidApplications, setPaidApplications] = useState([]);
//   const [correctionData, setCorrectionData] = useState({
//     open: false,
//     app: null,
//     message: "",
//   });

//   const dispatch = useDispatch();
//   const applications = useSelector(selectAllApplications);
//   const { user } = useSelector((state) => state.auth);
//   const { sentPayments } = useSelector((state) => state.payment);

//   useEffect(() => {
//     if (user?.role === "hiringperson") {
//       dispatch(fetchApplicationsByHiringPerson());
//     }
//   }, [dispatch, user]);

//   const handlePay = async (app) => {
//     const res = await dispatch(
//       createPaymentOrder({
//         amount: app.bidAmount || 100,
//         jobId: app.jobId?._id,
//         paidTo: app.userId?._id,
//       })
//     );

//     if (!res.payload) {
//       console.error("Payment creation failed:", res.error?.message);
//       alert("Failed to create Razorpay order");
//       return;
//     }

//     const { orderId, amount, currency, jobId, paidTo } = res.payload;

//     const loaded = await loadRazorpayScript();
//     if (!loaded) {
//       alert("Razorpay SDK failed to load");
//       return;
//     }

//     const options = {
//       key: "rzp_test_HnpMhDOhL0dI1d",
//       amount: amount.toString(),
//       currency,
//       order_id: orderId,
//       name: "Freelancer Platform",
//       description: "Pay for completed project",
//       handler: async (response) => {
//         const paymentData = {
//           razorpayPaymentId: response.razorpay_payment_id,
//           razorpayOrderId: response.razorpay_order_id,
//           amount,
//           jobId,
//           quotationId: app._id,
//           paidBy: user._id,
//           paidTo,
//         };
//         await dispatch(markPaymentSuccess(paymentData));
//         setPaidApplications((prev) => [...prev, app._id]);
//       },
//       prefill: {
//         name: user.name,
//         email: user.email,
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <div>
//       {applications
//         .filter((app) => app.submission?.link)
//         .map((app) => (
//           <div
//             key={app._id}
//             className="bg-gray-100 p-4 rounded-lg shadow-md mb-4"
//           >
//             <h3 className="text-lg font-semibold">
//               {app.jobId?.title || "No Title"}
//             </h3>
//             <p>
//               Job Seeker: {app.userId?.name || "Unknown"} | Status:{" "}
//               <span className="capitalize font-semibold">{app.status}</span>
//             </p>
//             <p className="text-sm text-gray-700 mt-1">
//               💰 Pay: <span className="font-semibold">₹{app.bidAmount}</span>
//             </p>
//             <p className="mb-2">Proposal: {app.message}</p>

//             <div className="mt-2 bg-white p-3 border rounded">
//               <p className="font-semibold text-gray-700">🔗 Submitted Work:</p>
//               <p>
//                 Link:{" "}
//                 <a
//                   href={app.submission.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 underline"
//                 >
//                   {app.submission.link}
//                 </a>
//               </p>
//               <p className="text-sm mt-1 text-gray-800">
//                 Message: {app.submission.message}
//               </p>
//               <p className="text-xs text-gray-400 mt-1">
//                 Submitted at:{" "}
//                 {new Date(app.submission.submittedAt).toLocaleString()}
//               </p>
//             </div>

//             <div className="flex gap-3 mt-3">
//               <button
//                 className="bg-yellow-600 text-white px-3 py-1 rounded text-sm"
//                 onClick={() =>
//                   setCorrectionData({
//                     open: true,
//                     app,
//                     message: "",
//                   })
//                 }
//               >
//                 Request Correction
//               </button>

//               {sentPayments.some((p) => p.quotationId === app._id) ? (
//                 <button
//                   disabled
//                   className="bg-green-500 text-white px-3 py-1 rounded text-sm cursor-not-allowed"
//                 >
//                   Paid
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handlePay(app)}
//                   className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
//                 >
//                   Pay
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}

//       {correctionData.open && (
//         <Modal
//           onClose={() =>
//             setCorrectionData({ open: false, app: null, message: "" })
//           }
//         >
//           <div className="p-4">
//             <h2 className="text-lg font-semibold mb-2">Request Correction</h2>
//             <textarea
//               rows={4}
//               className="w-full border border-gray-300 p-2 rounded"
//               placeholder="Explain the required changes..."
//               value={correctionData.message}
//               onChange={(e) =>
//                 setCorrectionData((prev) => ({
//                   ...prev,
//                   message: e.target.value,
//                 }))
//               }
//             />

//             <div className="flex justify-end gap-3 mt-4">
//               <button
//                 className="bg-gray-300 px-4 py-1 rounded"
//                 onClick={() =>
//                   setCorrectionData({ open: false, app: null, message: "" })
//                 }
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-600 text-white px-4 py-1 rounded"
//                 onClick={async () => {
//                   if (!correctionData.message.trim()) {
//                     toast.error("Please enter a correction message");
//                     return;
//                   }

//                   try {
//                     await dispatch(
//                       requestCorrection({
//                         quotationId: correctionData.app._id,
//                         message: correctionData.message,
//                       })
//                     ).unwrap();
//                     toast.success("Correction request sent");
//                     setCorrectionData({ open: false, app: null, message: "" });
//                   } catch (err) {
//                     toast.error("Failed to send correction request");
//                   }
//                 }}
//               >
//                 Send Request
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default CompletedProjects;
