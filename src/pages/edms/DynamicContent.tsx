import React, { useState, Suspense } from 'react';
import { Search, Folder, FolderOpen, FileText, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';


const navJson = [
    {
        id: "project-data",
        title: "Project Data",
        type: "folder",
        children: [
            {
                id: "letters",
                title: "Letters",
                type: "folder",
                children: [
                    {
                        id: "incoming-letters",
                        title: "Incoming Letters",
                        type: "folder",
                        children: [
                            { id: "inc-admin", title: "Administration", type: "file", count: 340, component: "admin- edms/asset-management/index" },
                            { id: "inc-road-traffic", title: "Road & Traffic", type: "file", count: 791, component: "edms/incoming/road-traffic" },
                            { id: "inc-main-bridge", title: "Main Bridge", type: "file", count: 205, component: "edms/incoming/main-bridge" },
                            { id: "inc-rtw", title: "RTW", type: "file", count: 392, component: "edms/incoming/rtw" },
                            { id: "inc-toll-operation", title: "Toll Operation", type: "file", count: 503, component: "edms/incoming/toll-operation" },
                            { id: "inc-its", title: "ITS", type: "file", count: 356, component: "edms/incoming/its" }
                        ]
                    },
                    {
                        id: "outgoing-letters",
                        title: "Outgoing Letters",
                        type: "folder",
                        children: []
                    }
                ]
            }
        ]
    },
    {
        id: "administration-folder",
        title: "Administration",
        type: "folder",
        children: [
            { id: "emp-profile", title: "Employee Personal Profile", type: "file", count: "1,000", component: "admin/emp-profile" },
            { id: "vehicle-mgt", title: "Vehicle Management Record", type: "file", count: "1,000", component: "admin/vehicle-mgt-record/index" },
            { id: "asset-inventory", title: "Asset Inventory Management", type: "file", count: "1,000", component: "admin/asset-management/index" },
            { id: "building-maint", title: "Building Maintenance", type: "file", count: "1,000", component: "admin/building-maintenance/index" },
            { id: "health-center", title: "Health Center", type: "file", count: "1,000", component: "admin/health-center/index" },
            { id: "gardening-mgt", title: "Gardening Management", type: "file", count: "1,000", component: "admin/gardening/index" },
            { id: "fire-mgt", title: "Fire Management", type: "file", count: "1,000", component: "admin/fire-mgt/index" },
            { id: "it-electronics", title: "IT Electronics Communication", type: "file", count: "1,000", component: "admin/it-electronics-communication/index" },
            { id: "security-mgt", title: "Security Management", type: "file", count: "1,000", component: "admin/security-mgt/index" }
        ]
    },
    {
        id: "road-traffic-folder",
        title: "Road & Traffic",
        type: "folder",
        children: []
    }
];

type TreeNode = {
    id: string;
    title: string;
    type: 'folder' | 'file';
    count?: number | string;
    component?: string;
    children?: TreeNode[];
};

export default function EdmsFileExplorer() {
    const [searchQuery, setSearchQuery] = useState('');

    const [expanded, setExpanded] = useState<Set<string>>(
        new Set(['project-data', 'letters', 'incoming-letters', 'administration-folder'])
    );
    const [selected, setSelected] = useState<string | null>(null);
    const [ActiveComponent, setActiveComponent] = useState<null | React.ComponentType>(null);
    const [loadingComp, setLoadingComp] = useState(false);
    async function handleChildClick(child: TreeNode) {
        if (child.type === 'folder') {
            setExpanded(prev => {
                const next = new Set(prev);
                if (next.has(child.id)) next.delete(child.id);
                else next.add(child.id);
                return next;
            });
            return;
        }
        if (!child?.component) return;
        setSelected(child.id);
        setLoadingComp(true);

        try {
            const mod = await import(`/src/pages/${child.component}.tsx`);
            setActiveComponent(() => mod.default);
        } catch (err) {
            console.error('Failed to load component', err);
            setActiveComponent(() => () => (
                <div className='p-8 flex flex-col items-center justify-center text-red-500 bg-red-50/50 rounded-xl border border-red-100 h-full'>
                    <FileText size={48} className="mb-4 text-red-300" />
                    <h2 className="text-xl font-bold">Component Not Found</h2>
                    <p className="text-sm text-red-400 mt-2 text-center">
                        Make sure your file exists at: <br />
                        <code className="bg-white px-2 py-1 rounded border mt-2 block text-gray-700">@/pages/{child.component}.tsx</code>
                    </p>
                </div>
            ));
        } finally {
            setLoadingComp(false);
        }
    }
    const toggleExpandOnly = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };
    const renderTree = (nodes: TreeNode[], level = 0) => {
        return nodes.map((node) => {
            const isExpanded = expanded.has(node.id);
            const isSelected = selected === node.id;
            const hasChildren = node.children && node.children.length > 0;
            const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase());
            const hasMatchingChild = node.children?.some(child =>
                child.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (searchQuery && !matchesSearch && !hasMatchingChild) return null;

            return (
                <div key={node.id} className="flex flex-col">
                    <div
                        onClick={() => handleChildClick(node)}
                        className={`
              relative flex items-center w-full py-1.5 px-3 cursor-pointer select-none group
              ${isSelected ? 'bg-blue-50/70 text-[#2b5296]' : 'text-gray-700 hover:bg-gray-50'}
            `}
                        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
                    >
                        {/* Active Blue Side Bar */}
                        {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3b66b5]" />}

                        <div className="w-5 flex items-center justify-center mr-1">
                            {node.type === 'folder' && (
                                <button onClick={(e) => toggleExpandOnly(node.id, e)} className="text-gray-400 hover:text-gray-600">
                                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                            )}
                        </div>

                        <div className="mr-2 text-gray-400">
                            {node.type === 'folder' ? (
                                isExpanded ? <FolderOpen size={16} strokeWidth={2.5} className={isSelected ? 'text-[#3b66b5]' : ''} />
                                    : <Folder size={16} strokeWidth={2.5} className={isSelected ? 'text-[#3b66b5]' : ''} />
                            ) : (
                                <FileText size={16} strokeWidth={2.5} className={isSelected ? 'text-[#3b66b5]' : ''} />
                            )}
                        </div>

                        <span className={`text-sm flex-1 truncate ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                            {node.title}
                        </span>

                        {node.count !== undefined && (
                            <span className={`text-[11px] font-mono tracking-wider ml-2 ${isSelected ? 'text-[#3b66b5]' : 'text-gray-400'}`}>
                                {node.count}
                            </span>
                        )}
                    </div>

                    {isExpanded && hasChildren && (
                        <div className="flex flex-col">
                            {renderTree(node.children!, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="flex h-[calc(100vh-64px)] w-full bg-white overflow-hidden ">
            {/* Sidebar */}
            <div className="w-80 h-full flex flex-col border-r border-gray-200 bg-white shrink-0">
                <div className="p-4 pb-2 border-b border-gray-100">
                    <div className="relative flex items-center w-full h-9 rounded-md border border-gray-200 bg-gray-50 overflow-hidden focus-within:ring-1 focus-within:ring-[#3b66b5] focus-within:border-[#3b66b5] transition-all">
                        <div className="flex items-center justify-center pl-3 text-gray-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search folders & files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-full pl-2 pr-3 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                    {renderTree(navJson)}
                </div>
            </div>

       
            <div className="flex-1 h-full bg-[#f8f9fa] overflow-hidden relative flex flex-col">
                {loadingComp && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 text-[#0055aa] animate-spin" />
                            <p className="text-sm font-semibold text-[#0055aa] tracking-widest uppercase">Fetching Document...</p>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-hidden">
                    {!ActiveComponent && !loadingComp && (
                        <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 border-dashed shadow-sm">
                            <FolderOpen size={64} className="text-gray-200 mb-4" strokeWidth={1} />
                            <h1 className="text-3xl font-bold tracking-tight text-gray-300 mb-2">
                                No File Selected
                            </h1>
                            <p className="text-gray-400 text-sm">Select a document from the left sidebar to view its contents.</p>
                        </div>
                    )}

                    {ActiveComponent && (
                        <div className="h-full bg-white  border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            <Suspense
                                fallback={
                                    <div className="h-full flex items-center justify-center text-gray-400">
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                        Rendering Component...
                                    </div>
                                }
                            >
                                <ActiveComponent />
                            </Suspense>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}