import bundleModel from "../models/bundleModel.js";
import Bundle from "../models/bundleModel.js";
import Product from "../models/productModel.js";



// ✅ Fetch all bundles


const addBundles = async (req, res) => {
    try {
        const { name, category, coupons } = req.body;
        let { productIds } = req.body;

        // ✅ Ensure productIds is an array
        if (!Array.isArray(productIds)) {
            productIds = [productIds];
        }

        // ✅ Validate input
        if (!name || !productIds || productIds.length === 0 || !category) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // ✅ Store only the first coupon if multiple are sent
        const couponCode = Array.isArray(coupons) && coupons.length > 0 ? coupons[0] : "";

        // ✅ Fetch products from database
        const products = await Product.find({ _id: { $in: productIds } });

        // ✅ Ensure all products exist
        if (products.length !== productIds.length) {
            return res.status(400).json({ success: false, message: "Some products do not exist." });
        }

        // ✅ Create new bundle with a single coupon
        const newBundle = new Bundle({
            name,
            products: productIds,
            category,
            coupons: couponCode ? [couponCode] : [], // ✅ Only one coupon stored
        });

        await newBundle.save();
        res.status(201).json({ success: true, message: "Bundle created successfully.", bundle: newBundle });

    } catch (error) {
        console.error("Error creating bundle:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




const getList = async (req, res) => {
    try {
        const bundles = await Bundle.find().populate("products");
        res.json({ success: true, bundles });
    } catch (error) {
        console.error("Error fetching bundles:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const updateBundle = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received Bundle ID:", id); // ✅ Debugging log

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid Bundle ID." });
        }

        const bundle = await Bundle.findById(id);
        if (!bundle) {
            return res.status(404).json({ success: false, message: "Bundle not found." });
        }

        console.log("Updating bundle:", bundle); // ✅ Debugging log

        bundle.name = req.body.name;
        bundle.category = req.body.category;
        bundle.coupons = req.body.coupons ?? bundle.coupons;
        bundle.products = req.body.productIds;

        await bundle.save();
        res.status(200).json({ success: true, message: "Bundle updated successfully.", bundle });
    } catch (error) {
        console.error("Error updating bundle:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const deleteBundle = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBundle = await Bundle.findByIdAndDelete(id);
        if (!deletedBundle) {
            return res.status(404).json({ success: false, message: "Bundle not found" });
        }
        res.status(200).json({ success: true, message: "Bundle deleted successfully." });
    } catch (error) {
        console.error("Error deleting bundle:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
const singleBundle = async (req, res) => {
    try {
        const { id } = req.params; // Correct variable name

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid Bundle ID." });
        }

        const bundle = await bundleModel.findById(id);
        if (!bundle) {
            return res.status(404).json({ success: false, message: "Bundle not found" });
        }

        res.json({ success: true, bundle }); // Ensure the key is "bundle"
    } catch (error) {
        console.error("Error fetching bundle:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export { addBundles, getList, updateBundle, deleteBundle, singleBundle };
