import classNames from "classnames";

export interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {

};

const Panel = ({ children, className, ...rest }: Props) => {
    const baseClass = 'border rounded p-3 shadow bg-white w-full';
    return (
        <div {...rest} className={classNames(baseClass, className)}>
            {children}
        </div>
    );
}

export default Panel;