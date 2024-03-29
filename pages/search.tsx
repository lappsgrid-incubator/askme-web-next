import useSWR, { Fetcher } from "swr";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { AskMeError, AskMeResultData } from "@/types";
import SearchResultsCards from "@/components/SearchResultsCards";
import Pagination from "@/components/Pagination";


const fetcher: Fetcher<AskMeResultData, string> = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const { message, stack, details } = await res.json();
    const status = res.status;
    const error: AskMeError = { message, status, stack, details };
    throw error;
  }
  return res.json();
};


export default function Search()
{
  const router = useRouter();
  const { q, domains, type, page } = router.query;
  const typeString = type ? `&type=${type}` : "";
  const pageString = page ? `&page=${page}` : "&page=1";
  const domainsString = domains ? `&domains=${domains}` : "";

  const { data, error } = useSWR(
    q ? `/api/results?q=${q}${domainsString}${typeString}${pageString}` : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const handlePage = (pageNumber: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: pageNumber },
      },
      undefined,
      { shallow: true },
    );
  };

  if (error) {
    return <ErrorMessage status={error.status} message={error.message}
                         stack={error.stack} details={error.details}/>;
  }

  return (
    <div>
      {data ? (
        <div className="my-3 flex flex-col items-center">
          <SearchResultsCards results={data.documents} />
          {data.documents.length != 0 &&
            Object.keys(data.pages).length != 1 && (
              <Pagination pages={data.pages} handlePage={handlePage} />
            )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
