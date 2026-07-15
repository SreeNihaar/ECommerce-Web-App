import { useSearchParams } from "react-router-dom";

function Footer(){
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const totalPages = 48;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1, 2);
            if (currentPage > 4) pages.push("...");

            for (let i = Math.max(3, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 3) pages.push("...");
            pages.push(totalPages - 1, totalPages);
        }
        return pages;
    };

    return(
        <div className="Footer flex justify-center items-center gap-2 py-2 border-t bg-white">
            <button
                onClick={() => setSearchParams({ page: Math.max(1, currentPage - 1) })}
                disabled={currentPage === 1}
                className={`${
                        currentPage === 1 ? "" : "cursor-pointer"
                    } px-4 py-2 text-blue-600 disabled:text-gray-400`
                }
            >
                Previous
            </button>

            {getPageNumbers().map((page, idx) => (
                <button
                    key={idx}
                    onClick={() => typeof page === 'number' && setSearchParams({ page })}
                    disabled={page === "..."}
                    className={`px-3 py-2 border ${
                        page === currentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 hover:border-blue-600'
                    } ${page === "..." ? 'cursor-default' : 'cursor-pointer'}`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => setSearchParams({ page: Math.min(totalPages, currentPage + 1) })}
                disabled={currentPage === totalPages}
                className={`${
                        currentPage === totalPages ? "" : "cursor-pointer"
                    } px-4 py-2 text-blue-600 disabled:text-gray-400`
                }
            >
                Next
            </button>
        </div>
    );
}

export default Footer;