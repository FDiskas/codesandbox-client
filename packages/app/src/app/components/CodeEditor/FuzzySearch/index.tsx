import * as React from 'react';
import { sortBy, groupBy, flatten, values } from 'lodash';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import { getModulePath } from 'common/sandbox/modules';
import Input from 'common/components/Input';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import getType from 'app/utils/get-type';

import { Module, Directory } from 'app/store/modules/editor/types';

import {
    Container,
    InputContainer,
    Items,
    Entry,
    NotSyncedIconWithMargin,
    CurrentModuleText,
    Name,
    Path
} from './elements';

type Props = {
    modules: Module[];
    directories: Directory[];
    currentModuleId: string;
    setCurrentModule: (id: string) => void;
    closeFuzzySearch: () => void;
};

export default class FuzzySearch extends React.PureComponent<Props> {
    // This is a precached map of paths to module
    paths = {};

    componentWillMount() {
        const { modules, directories } = this.props;
        const modulePathData = modules.map((m) => {
            const path = getModulePath(modules, directories, m.id);
            return {
                m,
                path,
                depth: path.split('/').length
            };
        });

        const groupedPaths = groupBy(modulePathData, (n) => n.depth) as { m: any; path: any; depth: any };
        const sortedPaths = values(groupedPaths).map((group) => sortBy(group, (n) => n.path));
        const flattenedPaths = flatten(sortedPaths);

        this.paths = flattenedPaths.reduce(
            (paths, { m, path }) => ({
                ...paths,
                [m.id]: { path: path.replace('/', ''), m }
            }),
            {}
        );
    }

    itemToString = (m) => (m ? m.path : '');

    getItems = (value = '') => {
        const pathArray = Object.keys(this.paths).map((id) => this.paths[id]);

        return matchSorter(pathArray, value, { keys: [ 'path' ] });
    };

    onChange = (item) => {
        this.props.setCurrentModule(item.m.id);
    };

    handleKeyUp = (e) => {
        if (e.keyCode === 27) {
            this.props.closeFuzzySearch();
        }
    };

    render() {
        const { currentModuleId } = this.props;
        return (
            <Container>
                <Downshift
                    defaultHighlightedIndex={0}
                    defaultIsOpen
                    onChange={this.onChange}
                    itemToString={this.itemToString}
                >
                    {({ getInputProps, getItemProps, selectedItem, inputValue, highlightedIndex }) => (
                        <div style={{ width: '100%' }}>
                            <InputContainer>
                                <Input
                                    {...getInputProps({
                                        ref: (el) => el && el.focus(),
                                        onKeyUp: this.handleKeyUp,
                                        // Timeout so the fuzzy handler can still select the module
                                        onBlur: () => setTimeout(this.props.closeFuzzySearch, 100)
                                    })}
                                />
                            </InputContainer>
                            <Items>
                                {this.getItems(inputValue).map((item, index) => (
                                    <Entry
                                        {...getItemProps({
                                            item,
                                            index,
                                            isActive: highlightedIndex === index,
                                            isSelected: selectedItem === item
                                        })}
                                        key={item.m.id}
                                        isNotSynced={item.m.isNotSynced}
                                    >
                                        {item.m.isNotSynced && <NotSyncedIconWithMargin />}
                                        <EntryIcons
                                            type={getType(item.m.title, item.m.code)}
                                            error={item.m.errors && item.m.errors.length > 0}
                                        />
                                        <Name>{item.m.title}</Name>
                                        {item.m.title !== this.itemToString(item) && (
                                            <Path>{this.itemToString(item)}</Path>
                                        )}
                                        {item.m.id === currentModuleId && (
                                            <CurrentModuleText>currently opened</CurrentModuleText>
                                        )}
                                    </Entry>
                                ))}
                            </Items>
                        </div>
                    )}
                </Downshift>
            </Container>
        );
    }
}
