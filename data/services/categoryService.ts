import {Category} from '../models/categories';


export const createCategory = async (body: any) => {
    try {
        const category = new Category({
            name: body.name,
        });
        if (category.name == null) {
            throw new Error("Category name is required");
        }

        if(await findCategoryByName(category.name)) {
            throw new Error("Category already exists");
        }

        await category.save();
        return category;
    }
    catch (err) {
        throw err;
    }
}


export const findAllCategories = async (offset = 0, limit = 10, filter: string = '') => {
    try {
        // Parse the filter parameter
        const filterObject = filter ? { name: { $regex: filter, $options: 'i' } } : {};

        const categories = await Category.find(filterObject).skip(offset).limit(limit);
        const totalCategories = await Category.countDocuments(filterObject);
        const page = Math.floor(offset / limit) + 1;
        const hasMore = offset + limit < totalCategories;

        return {
            data: categories,
            pagination: {
                pageSize: limit,
                page: page,
                hasMore: hasMore,
                total: totalCategories,
            },
        };
    } catch (err) {
        throw err;
    }
}

export const findCategoryById = async (categoryId: string) => {
    try {
        const category = await Category.findById(categoryId);
        return category;
    }
    catch (err) {
        throw err;
    }
}


export const updateCategory = async (categoryId: string, body: any) => {
    try {
        const category = await Category.findById(categoryId);

        if (!category) {
            throw new Error("Category not found");
        }
        category.name = body.name;
        await category.save();

        return {message: "Category updated", category};
    }
    catch (error) {
        console.error(error);
        throw new Error("Internal Server Error");
    }
}


export const deleteCategoryById = async (categoryId: string) => {
    try {
        const category = await Category.findByIdAndDelete(categoryId);
        return category;
    }
    catch (err) {
        throw err;
    }
}

export const findCategoryByName = async (categoryName: string) => {
    try {
        const category = await Category.findOne({ name: categoryName });
        return category;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}
