//  const buildQueryParams = (pageNumber: number = pageNum) => {
//       const params = new URLSearchParams();

//       if (keyword) params.append("keyword", keyword as string);
//       if (category) params.append("category", category as string);
//       if (minPrice) params.append("minPrice", minPrice as string);
//       if (maxPrice) params.append("maxPrice", maxPrice as string);
//       if (color) {
//         if (Array.isArray(color)) {
//           color.forEach((c) => params.append("color", c as string));
//         } else {
//           params.append("color", color as string);
//         }
//       }
//       if (size) {
//         if (Array.isArray(size)) {
//           size.forEach((s) => params.append("size", s as string));
//         } else {
//           params.append("size", size as string);
//         }
//       }
//       if (sort_by) params.append("sort_by", sort_by as string);
//       if (sort_direction)
//         params.append("sort_direction", sort_direction as string);

//       params.append("limit", limitNum.toString());
//       params.append("page", pageNumber.toString());

//       return params.toString();
//     };
