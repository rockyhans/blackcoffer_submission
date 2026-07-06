import Data from "../models/Data.js";
import buildFilter from "../utils/buildFilter.js";
import { FILTER_FIELDS } from "../constants/filterFields.js";

export const getAllData = async (req, res) => {
    try {
        const filter = buildFilter(req.query);

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 20, 1);
        const skip = (page - 1) * limit;

        const select = req.query.fields
            ? req.query.fields.split(",").join(" ")
            : "";

        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, "i");

            filter.$or = [
                { title: searchRegex },
                { topic: searchRegex },
                { insight: searchRegex },
            ];
        }

        let query = Data.find(filter);

        if (select) {
            query = query.select(select);
        }

        if (req.query.sort) {
            query = query.sort(req.query.sort);
        }

        const total = await Data.countDocuments(filter);

        const data = await query.skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            count: data.length,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getFilters = async (req, res) => {
    try {
        const filters = {};

        await Promise.all(
            FILTER_FIELDS.map(async (field) => {
                let values = await Data.distinct(field);

                values = values
                    .filter(
                        (value) =>
                            value !== null &&
                            value !== undefined &&
                            value !== ""
                    )
                    .sort((a, b) =>
                        typeof a === "number"
                            ? a - b
                            : String(a).localeCompare(String(b))
                    );

                filters[field] = values;
            })
        );

        res.status(200).json({
            success: true,
            filters,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getStats = async (req, res) => {
    try {
        const [
            totalDocuments,
            totalCountries,
            totalTopics,
            totalRegions,
            totalSectors,
        ] = await Promise.all([
            Data.countDocuments(),
            Data.distinct("country"),
            Data.distinct("topic"),
            Data.distinct("region"),
            Data.distinct("sector"),
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalDocuments,
                totalCountries: totalCountries.filter(Boolean).length,
                totalTopics: totalTopics.filter(Boolean).length,
                totalRegions: totalRegions.filter(Boolean).length,
                totalSectors: totalSectors.filter(Boolean).length,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};