import Loading from "@/components/Loading";
import useSWR, { Fetcher } from "swr";
import { useRouter } from "next/router";
import ErrorMessage from "@/components/ErrorMessage";
import { useSettingsStore } from "@/store/settingsStore";
import { AskMeDocumentSingle, AskMeError } from "@/types";
import Link from "next/link";
import Head from "next/head";

const fetcher: Fetcher<AskMeDocumentSingle, string> = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const { message, stack, details } = await res.json();
    const status = res.status;
    const error: AskMeError = { message, status, stack, details };
    //console.log(error)
    throw error;
  }

  return res.json();
};

export default function Doc() {
  const settings = useSettingsStore();
  const router = useRouter();
  const { id } = router.query;

  const { data: document, error } = useSWR(
    id ? `/api/doc/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  if (error) {
    return <ErrorMessage status={error.status} message={error.message}
                         stack={error.stack} details={error.details}/>;
  }

  if (!document) {
    return <Loading />;
  }
  return (
    <>
    <div>
      <div className="mt-6 flex justify-center px-3">
        <article className="prose prose-h2:mt-8">
          <h1 className="mb-0">{document.title}</h1>
          <a href={document.url} target="_blank" className="line-clamp-1">
            {document.url}
          </a>
          <p className="text-sm">
            {document.authors.join(", ")} - {document.year}
          </p>
          <h2>Summary</h2>
          <p className="line-clamp-6">{document.summary}</p>
          <h2>Terms</h2>
          {settings.devMode ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Count</th>
                  <th>TF-IDF</th>
                </tr>
              </thead>
              <tbody>
                {document.terms.map((term, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <Link
                          className="link link-primary"
                          href={`/search?q=${term[0]}&type=exact`}
                        >
                          {term[0]}
                        </Link>
                      </td>
                      <td>{term[1]}</td>
                      <td>{term[2]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 pb-2">
              {document.terms.map((term, i) => {
                return (
                  <div key={i}>
                    <Link
                      className="link link-primary"
                      href={`/search?q=${term[0]}&type=exact`}
                    >
                      {term[0]}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </div>
    </div>
    </>
  );
}
