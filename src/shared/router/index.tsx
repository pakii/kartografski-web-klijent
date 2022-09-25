import React from "react";
import {
    NavigateFunction,
    Params,
    URLSearchParamsInit,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

export function withRouter(Component: typeof React.Component) {
    function ComponentWithRouterProp(props: any) {
        const location = useLocation();
        const navigate = useNavigate();
        const params = useParams();
        const [searchParams, setSearchParams] = useSearchParams();
        return (
            <Component
                {...props}
                router={{
                    location,
                    navigate,
                    params,
                    searchParams,
                    setSearchParams
                }}
            />
        );
    }

    return ComponentWithRouterProp;
}

export type WithRouterProps = {
    location: Location;
    navigate: NavigateFunction;
    pathParams: Readonly<Params<string>>;
    searchParams: URLSearchParams;
    setSearchParams: (nextInit: URLSearchParamsInit, navigateOptions?: {
        replace?: boolean | undefined;
        state?: any;
    } | undefined) => void
}
